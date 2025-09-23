'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Plus,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Star,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface Variant {
  size: string
  color: string
  price: number
  stock: number
  sku: string
}

interface Image {
  url: string
  alt: string
  primary: boolean
}

export default function NewProductPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [variants, setVariants] = useState<Variant[]>([
    { size: '', color: '', price: 0, stock: 0, sku: '' }
  ])
  const [images, setImages] = useState<Image[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    brand_id: '',
    category_id: '',
    featured: false,
    isNew: false,
    onSale: false,
    originalPrice: '',
    is_active: true
  })

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchBrandsAndCategories()
  }, [user, loading, router])

  const fetchBrandsAndCategories = async () => {
    try {
      // Récupérer les marques et catégories depuis l'API
      const [brandsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/categories')
      ])

      if (brandsResponse.ok) {
        const brandsData = await brandsResponse.json()
        setBrands(brandsData.brands || [])
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast.error('Erreur lors du chargement des données')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addVariant = () => {
    setVariants(prev => [...prev, { size: '', color: '', price: 0, stock: 0, sku: '' }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ))
  }

  const addImage = () => {
    setImages(prev => [...prev, { url: '', alt: '', primary: prev.length === 0 }])
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      // S'assurer qu'au moins une image est marquée comme primaire
      if (newImages.length > 0 && !newImages.some(img => img.primary)) {
        newImages[0].primary = true
      }
      return newImages
    })
  }

  const updateImage = (index: number, field: keyof Image, value: any) => {
    setImages(prev => {
      if (field === 'primary' && value) {
        // Si on marque une image comme primaire, démarquer les autres
        return prev.map((img, i) => ({
          ...img,
          primary: i === index
        }))
      } else {
        // Mise à jour normale
        return prev.map((img, i) => 
          i === index ? { ...img, [field]: value } : img
        )
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.brand_id || !formData.category_id) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setPageLoading(true)
    try {
      const response = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          variants: variants.filter(v => v.size || v.color || v.stock > 0),
          images: images.filter(img => img.url)
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Produit créé avec succès')
        router.push('/admin/products')
      } else {
        toast.error(result.error || 'Erreur lors de la création du produit')
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      toast.error('Erreur lors de la création du produit')
    } finally {
      setPageLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Nouveau Produit</h1>
            <p className="text-gray-400">Ajoutez un nouveau produit à votre catalogue</p>
          </div>
          
          <Button
            onClick={() => router.push('/admin/products')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-500" />
                Informations de Base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-white">Nom du produit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Ex: Air Max 90"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sku" className="text-white">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Ex: AM90-001"
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-white">Prix *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                      placeholder="99.99"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="originalPrice" className="text-white">Prix original (si en solde)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white pl-10"
                      placeholder="129.99"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="brand" className="text-white">Marque *</Label>
                  <select
                    id="brand"
                    value={formData.brand_id}
                    onChange={(e) => handleInputChange('brand_id', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Sélectionner une marque</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Catégorie *</Label>
                  <select
                    id="category"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  rows={4}
                  placeholder="Description détaillée du produit..."
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="featured" className="text-white flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Produit vedette
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) => handleInputChange('isNew', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="isNew" className="text-white flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-green-500" />
                    Nouveau produit
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="onSale"
                    checked={formData.onSale}
                    onChange={(e) => handleInputChange('onSale', e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="onSale" className="text-white flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    En solde
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variantes */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-purple-500" />
                  Variantes
                </span>
                <Button
                  type="button"
                  onClick={addVariant}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-800 rounded-lg">
                    <div>
                      <Label className="text-white text-sm">Taille</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="42"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">Couleur</Label>
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Noir"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">Prix</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="99.99"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="AM90-001-42"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={() => removeVariant(index)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-500 hover:bg-red-900"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-green-500" />
                  Images
                </span>
                <Button
                  type="button"
                  onClick={addImage}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="md:col-span-2">
                      <Label className="text-white text-sm">URL de l'image</Label>
                      <Input
                        value={image.url}
                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <Label className="text-white text-sm">Texte alternatif</Label>
                      <Input
                        value={image.alt}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Description de l'image"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={image.primary}
                          onChange={(e) => updateImage(index, 'primary', e.target.checked)}
                          className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                        />
                        <Label className="text-white text-sm">Primaire</Label>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-500 hover:bg-red-900"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              onClick={() => router.push('/admin/products')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Créer le produit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
