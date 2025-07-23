import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Heart, Calendar, Scale, Ruler } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePetshop } from '@/hooks/usePetshop';
import Layout from '@/components/Layout';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  weight: number;
  coat_type?: string;
  photo_url?: string;
  notes?: string;
  created_at: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    size: 'medium' as 'small' | 'medium' | 'large',
    weight: '',
    coat_type: '',
    photo_url: '',
    notes: '',
    customer_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { petshop } = usePetshop();

  useEffect(() => {
    loadPets();
    loadCustomers();
  }, []);

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          customer:customers(id, name, phone)
        `)
        .order('name');

      if (error) throw error;
      setPets(data as Pet[] || []);
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os pets",
        variant: "destructive",
      });
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.breed.trim() || !formData.customer_id) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome, raça e cliente são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const petData = {
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age) || 0,
        size: formData.size,
        weight: parseFloat(formData.weight) || 0,
        coat_type: formData.coat_type || null,
        photo_url: formData.photo_url || null,
        notes: formData.notes || null,
        customer_id: formData.customer_id
      };

      if (editingPet) {
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', editingPet.id);

        if (error) throw error;

        toast({
          title: "Pet atualizado!",
          description: "As informações foram salvas com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('pets')
          .insert([petData]);

        if (error) throw error;

        toast({
          title: "Pet cadastrado!",
          description: "O pet foi adicionado com sucesso",
        });
      }

      setIsDialogOpen(false);
      setEditingPet(null);
      resetForm();
      loadPets();
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o pet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      breed: pet.breed,
      age: pet.age.toString(),
      size: pet.size,
      weight: pet.weight.toString(),
      coat_type: pet.coat_type || '',
      photo_url: pet.photo_url || '',
      notes: pet.notes || '',
      customer_id: pet.customer.id
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (petId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pet?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      toast({
        title: "Pet excluído!",
        description: "O pet foi removido com sucesso",
      });

      loadPets();
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pet",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      age: '',
      size: 'medium',
      weight: '',
      coat_type: '',
      photo_url: '',
      notes: '',
      customer_id: ''
    });
  };

  const getSizeLabel = (size: string) => {
    const labels = {
      small: 'Pequeno',
      medium: 'Médio',
      large: 'Grande'
    };
    return labels[size as keyof typeof labels] || size;
  };

  const getSizeBadgeVariant = (size: string) => {
    const variants = {
      small: 'secondary',
      medium: 'default',
      large: 'destructive'
    };
    return variants[size as keyof typeof variants] || 'default';
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.customer.phone.includes(searchTerm)
  );

  const totalPets = pets.length;
  const petsBySize = {
    small: pets.filter(p => p.size === 'small').length,
    medium: pets.filter(p => p.size === 'medium').length,
    large: pets.filter(p => p.size === 'large').length
  };
  const averageAge = pets.length > 0 ? (pets.reduce((sum, p) => sum + p.age, 0) / pets.length).toFixed(1) : '0';

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-primary">Pets</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPet(null);
              resetForm();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPet ? 'Editar Pet' : 'Novo Pet'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="customer_id">Cliente *</Label>
                  <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
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
                <div>
                  <Label htmlFor="name">Nome do Pet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do pet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="breed">Raça *</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="Raça do pet"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Idade (anos)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="30"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="0.0"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="size">Porte</Label>
                  <Select value={formData.size} onValueChange={(value: any) => setFormData(prev => ({ ...prev, size: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeno (até 10kg)</SelectItem>
                      <SelectItem value="medium">Médio (10-25kg)</SelectItem>
                      <SelectItem value="large">Grande (acima de 25kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="coat_type">Tipo de Pelagem</Label>
                  <Select value={formData.coat_type} onValueChange={(value) => setFormData(prev => ({ ...prev, coat_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curto">Curto</SelectItem>
                      <SelectItem value="longo">Longo</SelectItem>
                      <SelectItem value="ondulado">Ondulado</SelectItem>
                      <SelectItem value="crespo">Crespo</SelectItem>
                      <SelectItem value="liso">Liso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="photo_url">URL da Foto</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    value={formData.photo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Informações adicionais sobre o pet (temperamento, alergias, etc.)"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPets}</p>
                <p className="text-sm text-muted-foreground">Total de Pets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ruler className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">P:{petsBySize.small} M:{petsBySize.medium} G:{petsBySize.large}</p>
                <p className="text-sm text-muted-foreground">Por Porte</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageAge}</p>
                <p className="text-sm text-muted-foreground">Idade Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold">{pets.length > 0 ? (pets.reduce((sum, p) => sum + p.weight, 0) / pets.length).toFixed(1) : '0'} kg</p>
                <p className="text-sm text-muted-foreground">Peso Médio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Pets</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Raça</TableHead>
                <TableHead>Pelagem</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Porte</TableHead>
                <TableHead>Peso</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {pet.photo_url && (
                        <img 
                          src={pet.photo_url} 
                          alt={pet.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <span>{pet.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>{pet.coat_type || '-'}</TableCell>
                  <TableCell>{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</TableCell>
                  <TableCell>
                    <Badge variant={getSizeBadgeVariant(pet.size) as any}>
                      {getSizeLabel(pet.size)}
                    </Badge>
                  </TableCell>
                  <TableCell>{pet.weight} kg</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{pet.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{pet.customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(pet)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(pet.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum pet encontrado para a busca.' : 'Nenhum pet cadastrado ainda.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
}