import { storeData } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCart from "@/components/ui/AddToCart";
import { Metadata } from "next";

export async function generateStaticParams() {
  return storeData.products.map((product) => ({
    slug: product.id,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const product = storeData.products.find((p) => p.id === params.slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  return {
    title: `${product.name} | Ground Culture`,
    description: product.description,
    alternates: {
      canonical: `/produto/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Ground Culture`,
      description: product.description,
      url: `/produto/${product.id}`,
      images: [
        {
          url: product.images[0],
          width: 640,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProdutoPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = storeData.products.find(p => p.id === params.slug);
  
  if (!product) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: "BRL",
      price: product.price,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-bgPrimary text-white min-h-screen pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Images */}
          <div className="space-y-4 lg:sticky lg:top-32">
            {product.images.map((img, i) => (
              <div key={i} className="aspect-[4/5] relative bg-bgTertiary rounded-xl overflow-hidden shadow-2xl border border-borderLight">
                <Image 
                  src={img}
                  alt={`${product.name} - Imagem ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Product Info (Sticky) */}
          <div className="lg:py-12">
            <div className="mb-10 border-b border-borderPrimary pb-8">
              <h1 className="text-5xl md:text-6xl font-display font-medium tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-white/60 font-light">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <div className="space-y-12">
              <div>
                <p className="text-lg text-white/80 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              <AddToCart product={product} />

              <div className="border-t border-borderPrimary mt-10 pt-8">
                <h4 className="font-bold uppercase tracking-widest text-xs text-white/50 mb-4">Detalhes do Produto</h4>
                <ul className="list-disc pl-4 space-y-2 text-white/70 font-light text-sm">
                  <li>Tecido de combate de alta performance</li>
                  <li>Blend Premium (Poliamida + Elastano)</li>
                  <li>Costura elástica reforçada</li>
                  <li>Proteção UV 50+</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
