import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, ShoppingCart, CreditCard, Banknote, Smartphone, BarChart3, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePetshop } from '@/hooks/usePetshop';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  brand?: string;
  unit: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface SaleItem {
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function PDV() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [barcode, setBarcode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix' | 'multiple'>('cash');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { petshop } = usePetshop();

  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      });
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const searchProductByBarcode = async (barcodeValue: string) => {
    if (!barcodeValue.trim()) return;

    const product = products.find(p => p.barcode === barcodeValue);
    if (product) {
      addProductToSale(product);
      setBarcode('');
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Código de barras não encontrado no sistema",
        variant: "destructive",
      });
    }
  };

  const addProductToSale = (product: Product, quantity: number = 1) => {
    if (product.stock_quantity < quantity) {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${product.stock_quantity} unidades disponíveis`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = saleItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock_quantity < newQuantity) {
        toast({
          title: "Estoque insuficiente",
          description: `Apenas ${product.stock_quantity} unidades disponíveis`,
          variant: "destructive",
        });
        return;
      }
      
      setSaleItems(prev => prev.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: newQuantity, total_price: newQuantity * product.price }
          : item
      ));
    } else {
      setSaleItems(prev => [...prev, {
        product,
        quantity,
        unit_price: product.price,
        total_price: product.price * quantity
      }]);
    }
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setSaleItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity, total_price: newQuantity * item.unit_price }
        : item
    ));
  };

  const removeItem = (productId: string) => {
    setSaleItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + item.total_price, 0);
    return subtotal - discount;
  };

  const processSale = async () => {
    if (saleItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos para finalizar a venda",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const total = calculateTotal();
      
      // Criar a venda
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          petshop_id: petshop?.id || '',
          customer_id: selectedCustomer || null,
          total_amount: saleItems.reduce((sum, item) => sum + item.total_price, 0),
          discount_amount: discount,
          final_amount: total,
          payment_method: paymentMethod,
          status: 'completed'
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Criar os itens da venda
      const saleItemsData = saleItems.map(item => ({
        sale_id: sale.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItemsData);

      if (itemsError) throw itemsError;

      // Atualizar estoque
      for (const item of saleItems) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: item.product.stock_quantity - item.quantity 
          })
          .eq('id', item.product.id);

        if (stockError) throw stockError;
      }

      // Gerar cupom
      generateReceipt(sale, saleItems, total);

      // Limpar formulário
      setSaleItems([]);
      setSelectedCustomer('');
      setDiscount(0);
      setBarcode('');
      setSearchTerm('');

      // Recarregar produtos para atualizar estoque
      loadProducts();

      toast({
        title: "Venda finalizada!",
        description: "Cupom gerado com sucesso",
      });

    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast({
        title: "Erro",
        description: "Não foi possível finalizar a venda",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReceipt = (sale: any, items: SaleItem[], total: number) => {
    const customer = customers.find(c => c.id === selectedCustomer);
    const now = new Date();
    
    const receiptContent = `
      <div style="font-family: monospace; font-size: 12px; max-width: 300px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
          <h2>PETSHOP CARE</h2>
          <p>CUPOM NÃO FISCAL</p>
          <p>${now.toLocaleString('pt-BR')}</p>
          <p>Venda: ${sale.id.slice(-8)}</p>
        </div>
        
        ${customer ? `
          <div style="border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
            <strong>Cliente:</strong><br>
            ${customer.name}<br>
            ${customer.phone}
          </div>
        ` : ''}
        
        <div style="border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px;">
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Item</th>
                <th>Qtd</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.product.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">R$ ${item.total_price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div style="text-align: right;">
          <p>Subtotal: R$ ${saleItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}</p>
          ${discount > 0 ? `<p>Desconto: R$ ${discount.toFixed(2)}</p>` : ''}
          <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>
          <p>Pagamento: ${getPaymentMethodLabel(paymentMethod)}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; font-size: 10px;">
          <p>Obrigado pela preferência!</p>
          <p>www.petshopcare.com.br</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: 'Dinheiro',
      card: 'Cartão',
      pix: 'PIX',
      multiple: 'Múltiplas formas'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode && product.barcode.includes(searchTerm))
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">PDV - Ponto de Venda</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <ShoppingCart className="h-5 w-5 mr-2" />
          {saleItems.length} {saleItems.length === 1 ? 'item' : 'itens'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <div className="flex gap-2">
                    <Input
                      id="barcode"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Digite ou escaneie o código"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          searchProductByBarcode(barcode);
                        }
                      }}
                    />
                    <Button onClick={() => searchProductByBarcode(barcode)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="search">Buscar por Nome</Label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite o nome do produto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => addProductToSale(product)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-primary">R$ {product.price.toFixed(2)}</span>
                        <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                          {product.stock_quantity} {product.unit}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrinho e Finalização */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carrinho de Compras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer">Cliente (Opcional)</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {saleItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">R$ {item.unit_price.toFixed(2)} cada</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.product.id, parseInt(e.target.value) || 0)}
                        className="w-16 h-8"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {saleItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Carrinho vazio
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Finalizar Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="discount">Desconto (R$)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="payment">Forma de Pagamento</Label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Dinheiro
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Cartão
                      </div>
                    </SelectItem>
                    <SelectItem value="pix">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        PIX
                      </div>
                    </SelectItem>
                    <SelectItem value="multiple">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Múltiplas formas
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {saleItems.reduce((sum, item) => sum + item.total_price, 0).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Desconto:</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={processSale}
                disabled={saleItems.length === 0 || isProcessing}
              >
                {isProcessing ? 'Processando...' : 'Finalizar Venda'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}