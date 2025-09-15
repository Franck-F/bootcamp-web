"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Save, AlertTriangle, Package } from "lucide-react"
import { mockProducts, type Product } from "@/lib/mock-data"

export function StockManagement() {
  const [products, setProducts] = useState(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const updateProductStock = (productId: string, sizeIndex: number, newStock: number) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          const updatedSizes = [...product.sizes]
          updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: Math.max(0, newStock) }
          return { ...product, sizes: updatedSizes }
        }
        return product
      }),
    )
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
    setSelectedProduct(updatedProduct)
    setIsEditing(false)
  }

  const getLowStockProducts = () => {
    return products.filter((product) => product.sizes.some((size) => size.stock <= 5 && size.stock > 0))
  }

  const getOutOfStockProducts = () => {
    return products.filter((product) => product.sizes.every((size) => size.stock === 0))
  }

  const getTotalStock = (product: Product) => {
    return product.sizes.reduce((total, size) => total + size.stock, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion des stocks</h1>
          <p className="text-muted-foreground">Gérez l'inventaire de vos produits</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stock Alerts */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Stock faible
              </CardTitle>
              <CardDescription>Produits avec moins de 5 unités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getLowStockProducts().map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                    <Badge variant="warning" className="text-xs">
                      {getTotalStock(product)} restant
                    </Badge>
                  </div>
                ))}
                {getLowStockProducts().length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun produit en stock faible</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-500" />
                Rupture de stock
              </CardTitle>
              <CardDescription>Produits indisponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getOutOfStockProducts().map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Épuisé
                    </Badge>
                  </div>
                ))}
                {getOutOfStockProducts().length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun produit en rupture</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Inventaire des produits</CardTitle>
              <CardDescription>Cliquez sur un produit pour gérer son stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.brand} • {product.price}€
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{getTotalStock(product)} unités</p>
                        <p className="text-sm text-muted-foreground">{product.sizes.length} tailles</p>
                      </div>
                    </div>

                    {/* Stock by size */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <div key={size.size} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">T{size.size}:</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateProductStock(product.id, index, size.stock - 1)
                              }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs font-medium w-6 text-center">{size.stock}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateProductStock(product.id, index, size.stock + 1)
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Detail Modal/Panel */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedProduct.name}</CardTitle>
                  <CardDescription>{selectedProduct.brand}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Annuler" : "Modifier"}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                    Fermer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <ProductEditForm
                  product={selectedProduct}
                  onSave={updateProduct}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <ProductStockView product={selectedProduct} onUpdateStock={updateProductStock} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function ProductStockView({
  product,
  onUpdateStock,
}: {
  product: Product
  onUpdateStock: (productId: string, sizeIndex: number, newStock: number) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Prix</Label>
          <p className="text-lg font-bold">{product.price}€</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Stock total</Label>
          <p className="text-lg font-bold">{product.sizes.reduce((total, size) => total + size.stock, 0)} unités</p>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">Gestion du stock par taille</Label>
        <div className="space-y-3">
          {product.sizes.map((size, index) => (
            <div key={size.size} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">Taille {size.size}</span>
                <Badge
                  variant={size.stock === 0 ? "destructive" : size.stock <= 5 ? "warning" : "success"}
                  className="ml-2"
                >
                  {size.stock === 0 ? "Épuisé" : size.stock <= 5 ? "Stock faible" : "En stock"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => onUpdateStock(product.id, index, size.stock - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{size.stock}</span>
                <Button variant="outline" size="icon" onClick={() => onUpdateStock(product.id, index, size.stock + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductEditForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(product)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du produit</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Marque</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={formData.category}
            onValueChange={(value: "men" | "women" | "kids") => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Homme</SelectItem>
              <SelectItem value="women">Femme</SelectItem>
              <SelectItem value="kids">Enfant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
          />
          <Label htmlFor="featured">Produit mis en avant</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNew"
            checked={formData.isNew}
            onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked as boolean })}
          />
          <Label htmlFor="isNew">Nouveau produit</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="onSale"
            checked={formData.onSale}
            onCheckedChange={(checked) => setFormData({ ...formData, onSale: checked as boolean })}
          />
          <Label htmlFor="onSale">En solde</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </form>
  )
}
