import Link from "next/link";
import { getProductById } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar, faLeaf, faExclamationTriangle, faBarcode, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await getProductById(params.id);

    // Detectamos si hay alérgenos para cambiar el estilo de la tarjeta
    const hasAllergens = product.allergens && product.allergens.length > 0;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-6 flex justify-center">
            <div className="w-full max-w-5xl">

                {/* Botón Volver */}
                <div className="mb-8">
                    <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors">
                        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" /> Back to products
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUMNA IZQUIERDA (2/3): Información Principal */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* CABECERA DE PRODUCTO */}
                        <div className="flex justify-between items-center gap-4">
                            <div>
                                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">{product.brand}</p>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4">
                                    {/* Rating */}
                                    {product.rating !== undefined && (
                                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md border border-yellow-100 dark:border-yellow-800/30">
                                            <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                                            <span className="font-bold text-gray-800 dark:text-gray-200">{product.rating}</span>
                                            <span className="text-gray-400 text-xs">/ 5.0</span>
                                        </div>
                                    )}

                                    {/* BARCODE */}
                                    {product.barcode && (
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                            <FontAwesomeIcon icon={faBarcode} className="w-3 h-3" />
                                            <span>{product.barcode}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* PRECIO */}
                            <div className="text-right shrink-0">
                                <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white block">
                                    {product.price}€
                                </span>
                                <span className="text-xs text-gray-500 font-medium">+ tax included</span>
                            </div>
                        </div>

                        {/* DESCRIPCIÓN */}
                        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold text-lg mb-3">Description</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {product.description || "No specific description provided for this product."}
                                </p>
                            </CardContent>
                        </Card>

                        {/* INGREDIENTES Y ALÉRGENOS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Ingredientes (Siempre visible si hay) */}
                            {product.ingredients && product.ingredients.length > 0 && (
                                <Card className="h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faLeaf} className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            Ingredients
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-1">
                                            {product.ingredients.map((ing, i) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                    <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-green-400 shrink-0" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Alérgenos (Lógica modificada) */}
                            <Card className={`h-full transition-colors ${hasAllergens ? 'border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/5' : 'border-gray-100 dark:border-gray-800'}`}>
                                <CardHeader className="pb-2">
                                    <CardTitle className={`text-base font-semibold flex items-center gap-2 ${hasAllergens ? 'text-red-700 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasAllergens ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                            <FontAwesomeIcon
                                                icon={hasAllergens ? faExclamationTriangle : faCheckCircle}
                                                className={`w-4 h-4 ${hasAllergens ? '' : 'text-green-500'}`}
                                            />
                                        </div>
                                        Allergens
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {hasAllergens ? (
                                        <div className="flex flex-wrap gap-2">
                                            {product.allergens!.map((alg, i) => (
                                                <span key={i} className="bg-white dark:bg-red-950 text-red-700 dark:text-red-200 text-xs px-3 py-1 rounded-full font-medium border border-red-200 dark:border-red-800 shadow-sm">
                                                    {alg}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic flex items-center gap-2">
                                            No allergens found.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                    {/* COLUMNA DERECHA (1/3): Sidebar de compra */}
                    <div className="space-y-6">

                        {/* Panel de Compra */}
                        <Card className="shadow-lg border-blue-100 dark:border-blue-900/20 overflow-hidden">
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Availability</span>
                                    {product.stock && product.stock > 0 ? (
                                        <span className="text-green-700 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm">
                                            {product.stock} in stock
                                        </span>
                                    ) : (
                                        <span className="text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full text-sm">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {product.partOfLoyaltyProgram && (
                                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm">
                                        <p className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2 mb-1">
                                            <FontAwesomeIcon icon={faStar} className="w-3 h-3" /> Loyalty Rewards
                                        </p>
                                        <p className="text-amber-700 dark:text-amber-300">
                                            Earn <strong className="text-lg">{product.pointsGiven} pts</strong> with this purchase
                                        </p>
                                        {product.pointsCost && (
                                            <p className="text-xs text-amber-600/80 mt-1 pt-1 border-t border-amber-200/50">
                                                Redeemable for {product.pointsCost} pts
                                            </p>
                                        )}
                                    </div>
                                )}

                                <Button
                                    className="w-full font-bold text-lg h-12 shadow-blue-200 dark:shadow-none"
                                    size="lg"
                                    disabled={!product.available || (product.stock !== undefined && product.stock <= 0)}
                                >
                                    {product.available && (product.stock === undefined || product.stock > 0)
                                        ? "Add to Basket"
                                        : "Unavailable"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Información Nutricional */}
                        {(product.kcal || product.carbs || product.fats || product.proteins) && (
                            <Card>
                                <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                                    <CardTitle className="text-sm font-semibold uppercase text-gray-500 tracking-wide">
                                        Nutritional Info <span className="normal-case font-normal opacity-70">(per 100g)</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg text-center">
                                            <span className="text-xs text-gray-500 uppercase block mb-1">Calories</span>
                                            <span className="font-bold text-gray-900 dark:text-white text-lg">{product.kcal}</span>
                                            <span className="text-xs text-gray-400"> kcal</span>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg text-center">
                                            <span className="text-xs text-gray-500 uppercase block mb-1">Protein</span>
                                            <span className="font-bold text-gray-900 dark:text-white text-lg">{product.proteins}</span>
                                            <span className="text-xs text-gray-400"> g</span>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg text-center">
                                            <span className="text-xs text-gray-500 uppercase block mb-1">Carbs</span>
                                            <span className="font-bold text-gray-900 dark:text-white text-lg">{product.carbs}</span>
                                            <span className="text-xs text-gray-400"> g</span>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg text-center">
                                            <span className="text-xs text-gray-500 uppercase block mb-1">Fats</span>
                                            <span className="font-bold text-gray-900 dark:text-white text-lg">{product.fats}</span>
                                            <span className="text-xs text-gray-400"> g</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}