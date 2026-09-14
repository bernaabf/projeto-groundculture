import { storeData } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { Metadata } from "next";
import { LetteringText } from "@/components/ui/LetteringText";

export const metadata: Metadata = {
  title: "Collection | Ground Culture",
  description: "Full collection of Ground Culture rashguards and fightwear.",
};

export default function ProdutosPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const { categoria } = searchParams;
  
  let products = storeData.products;
  if (categoria) {
    products = products.filter(p => p.category === categoria);
  }

  const categorias = ["Manga Curta", "Manga Longa"];

  return (
    <div className="bg-bgPrimary text-white min-h-screen pt-40 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="lg:sticky lg:top-32">
              <h3 className="font-bold uppercase tracking-widest text-xs text-white/40 mb-6 pb-4 border-b border-borderPrimary">
                Categorias
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/produtos" 
                    className={`text-lg transition-colors ${!categoria ? 'text-white font-medium' : 'text-white/50 hover:text-white'}`}
                  >
                    Toda a Coleção
                  </Link>
                </li>
                {categorias.map(cat => (
                  <li key={cat}>
                    <Link 
                      href={`/produtos?categoria=${cat}`} 
                      className={`text-lg transition-colors ${categoria === cat ? 'text-white font-medium' : 'text-white/50 hover:text-white'}`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-12 border-b border-borderPrimary pb-8 flex items-end justify-between">
              <LetteringText 
                text={categoria ? categoria : "Todos os Produtos"}
                className="text-5xl md:text-6xl font-display font-medium tracking-tight text-white"
              />
              <p className="text-sm font-medium uppercase tracking-widest text-white/40">{products.length} Itens</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
