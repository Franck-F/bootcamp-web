import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Accueil
        </Link>
        <span>/</span>
        <span className="text-foreground">Guide des tailles</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Guide des tailles</h1>
          <p className="text-muted-foreground">
            Trouvez votre taille parfaite grâce à nos tableaux de correspondance détaillés
          </p>
        </div>

        <Tabs defaultValue="men" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="men">Homme</TabsTrigger>
            <TabsTrigger value="women">Femme</TabsTrigger>
            <TabsTrigger value="kids">Enfant</TabsTrigger>
          </TabsList>

          <TabsContent value="men" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tailles Homme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">EU</th>
                        <th className="text-left p-3 font-medium">US</th>
                        <th className="text-left p-3 font-medium">UK</th>
                        <th className="text-left p-3 font-medium">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { eu: 39, us: 6.5, uk: 6, cm: 25 },
                        { eu: 40, us: 7, uk: 6.5, cm: 25.5 },
                        { eu: 41, us: 8, uk: 7.5, cm: 26 },
                        { eu: 42, us: 8.5, uk: 8, cm: 26.5 },
                        { eu: 43, us: 9.5, uk: 9, cm: 27.5 },
                        { eu: 44, us: 10, uk: 9.5, cm: 28 },
                        { eu: 45, us: 11, uk: 10.5, cm: 29 },
                        { eu: 46, us: 12, uk: 11.5, cm: 30 },
                        { eu: 47, us: 13, uk: 12.5, cm: 31 },
                        { eu: 48, us: 14, uk: 13.5, cm: 32 },
                        { eu: 49, us: 15, uk: 14.5, cm: 33 },
                        { eu: 50, us: 16, uk: 15.5, cm: 34 },
                      ].map((size) => (
                        <tr key={size.eu} className="border-b hover:bg-muted/50">
                          <td className="p-3">{size.eu}</td>
                          <td className="p-3">{size.us}</td>
                          <td className="p-3">{size.uk}</td>
                          <td className="p-3">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="women" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tailles Femme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">EU</th>
                        <th className="text-left p-3 font-medium">US</th>
                        <th className="text-left p-3 font-medium">UK</th>
                        <th className="text-left p-3 font-medium">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { eu: 35, us: 5, uk: 2.5, cm: 22.5 },
                        { eu: 36, us: 6, uk: 3.5, cm: 23 },
                        { eu: 37, us: 6.5, uk: 4, cm: 23.5 },
                        { eu: 38, us: 7.5, uk: 5, cm: 24.5 },
                        { eu: 39, us: 8, uk: 5.5, cm: 25 },
                        { eu: 40, us: 8.5, uk: 6, cm: 25.5 },
                        { eu: 41, us: 9.5, uk: 7, cm: 26.5 },
                        { eu: 42, us: 10, uk: 7.5, cm: 27 },
                        { eu: 43, us: 11, uk: 8.5, cm: 28 },
                        { eu: 44, us: 12, uk: 9.5, cm: 29 },
                        { eu: 45, us: 13, uk: 10.5, cm: 30 },
                        { eu: 46, us: 14, uk: 11.5, cm: 31 },
                        { eu: 47, us: 15, uk: 12.5, cm: 32 },
                        { eu: 48, us: 16, uk: 13.5, cm: 33 },
                        { eu: 49, us: 17, uk: 14.5, cm: 34 },
                        { eu: 50, us: 18, uk: 15.5, cm: 35 },
                      ].map((size) => (
                        <tr key={size.eu} className="border-b hover:bg-muted/50">
                          <td className="p-3">{size.eu}</td>
                          <td className="p-3">{size.us}</td>
                          <td className="p-3">{size.uk}</td>
                          <td className="p-3">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kids" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tailles Enfant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">EU</th>
                        <th className="text-left p-3 font-medium">US</th>
                        <th className="text-left p-3 font-medium">UK</th>
                        <th className="text-left p-3 font-medium">CM</th>
                        <th className="text-left p-3 font-medium">Âge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { eu: 16, us: 1, uk: 0.5, cm: 9.5, age: "0-3 mois" },
                        { eu: 17, us: 1.5, uk: 1, cm: 10.5, age: "3-6 mois" },
                        { eu: 18, us: 2.5, uk: 2, cm: 11, age: "6-9 mois" },
                        { eu: 19, us: 3, uk: 2.5, cm: 11.5, age: "9-12 mois" },
                        { eu: 20, us: 4, uk: 3.5, cm: 12.5, age: "12-15 mois" },
                        { eu: 21, us: 4.5, uk: 4, cm: 13, age: "15-18 mois" },
                        { eu: 22, us: 5.5, uk: 5, cm: 13.5, age: "18-24 mois" },
                        { eu: 23, us: 6, uk: 5.5, cm: 14.5, age: "2 ans" },
                        { eu: 24, us: 7, uk: 6.5, cm: 15, age: "2-3 ans" },
                        { eu: 25, us: 8, uk: 7.5, cm: 15.5, age: "3 ans" },
                        { eu: 26, us: 8.5, uk: 8, cm: 16.5, age: "3-4 ans" },
                        { eu: 27, us: 9.5, uk: 9, cm: 17, age: "4 ans" },
                        { eu: 28, us: 10.5, uk: 10, cm: 17.5, age: "4-5 ans" },
                        { eu: 29, us: 11, uk: 10.5, cm: 18, age: "5 ans" },
                        { eu: 30, us: 12, uk: 11.5, cm: 18.5, age: "5-6 ans" },
                        { eu: 31, us: 13, uk: 12.5, cm: 19.5, age: "6 ans" },
                        { eu: 32, us: 1, uk: 13.5, cm: 20, age: "6-7 ans" },
                        { eu: 33, us: 1.5, uk: 1, cm: 20.5, age: "7 ans" },
                        { eu: 34, us: 2.5, uk: 2, cm: 21.5, age: "7-8 ans" },
                        { eu: 35, us: 3, uk: 2.5, cm: 22, age: "8 ans" },
                        { eu: 36, us: 4, uk: 3.5, cm: 22.5, age: "8-9 ans" },
                        { eu: 37, us: 4.5, uk: 4, cm: 23.5, age: "9 ans" },
                        { eu: 38, us: 5.5, uk: 5, cm: 24, age: "9-10 ans" },
                        { eu: 39, us: 6, uk: 5.5, cm: 24.5, age: "10+ ans" },
                      ].map((size) => (
                        <tr key={size.eu} className="border-b hover:bg-muted/50">
                          <td className="p-3">{size.eu}</td>
                          <td className="p-3">{size.us}</td>
                          <td className="p-3">{size.uk}</td>
                          <td className="p-3">{size.cm}</td>
                          <td className="p-3 text-sm text-muted-foreground">{size.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Measurement Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Comment mesurer votre pied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Étapes à suivre :</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="font-medium text-primary">1.</span>
                    Placez une feuille de papier contre un mur
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-primary">2.</span>
                    Posez votre pied sur la feuille, talon contre le mur
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-primary">3.</span>
                    Marquez l'extrémité de votre orteil le plus long
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-primary">4.</span>
                    Mesurez la distance entre le mur et la marque
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-primary">5.</span>
                    Répétez pour l'autre pied et prenez la plus grande mesure
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Conseils :</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Mesurez vos pieds en fin de journée quand ils sont légèrement gonflés</li>
                  <li>• Portez des chaussettes similaires à celles que vous porterez avec les sneakers</li>
                  <li>• En cas de doute entre deux tailles, choisissez la plus grande</li>
                  <li>• Les tailles peuvent varier légèrement selon les marques</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
