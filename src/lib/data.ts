export type Category = "Manga Curta" | "Manga Longa";

export interface Product {
  id: string;
  url: string;
  name: string;
  price: number;
  comparePrice: number | null;
  description: string;
  images: string[];
  variants: string[];
  category: Category;
}

export interface StoreData {
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
  };
  products: Product[];
}

export const storeData: StoreData = {
  contact: {
    whatsapp: "https://wa.me/5581991614811",
    instagram: "https://instagram.com/groundculture.store",
    email: "contato@groundculture.com.br"
  },
  products: [
    {
      id: "rashguard-gc-rasta-lion-manga-curta-ulpz6",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/rashguard-gc-rasta-lion-manga-curta-ulpz6/",
      name: "Rashguard GC Rasta Lion (manga curta)",
      price: 159.99,
      comparePrice: null,
      description: "Rashguard Ground Culture Rasta Lion. Produzida em tecido de alta performance, perfeita para os seus treinos de Jiu-Jitsu e submission. Costura reforçada e design exclusivo.",
      images: [
        "/images/products/rasta-lion-mc.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Curta"
    },
    {
      id: "rashguard-gc-black-lion-manga-curta-1gqx8",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/rashguard-gc-black-lion-manga-curta-1gqx8/",
      name: "Rashguard GC Black Lion (manga curta)",
      price: 159.99,
      comparePrice: null,
      description: "Rashguard Ground Culture Black Lion. A clássica. Produzida em tecido de alta performance, perfeita para os seus treinos de Jiu-Jitsu e submission.",
      images: [
        "/images/products/black-lion-mc.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Curta"
    },
    {
      id: "rashguard-gc-olive-lion-manga-curta-1j5ju",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/rashguard-gc-olive-lion-manga-curta-1j5ju/",
      name: "Rashguard GC Olive Lion (manga curta)",
      price: 159.99,
      comparePrice: null,
      description: "Rashguard Ground Culture Olive Lion. Tom verde militar e tecido de alta performance.",
      images: [
        "/images/products/olive-lion-mc.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Curta"
    },
    {
      id: "gc-core-blue-manga-curta-1ybv3",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/gc-core-blue-manga-curta-1ybv3/",
      name: "Rashguard GC CORE Blue (manga curta)",
      price: 159.99,
      comparePrice: null,
      description: "Rashguard Ground Culture CORE Blue. Design limpo e essencial. Tecido com tecnologia de compressão ideal.",
      images: [
        "/images/products/core-blue-mc.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Curta"
    },
    {
      id: "rashguard-gc-blackout-2-0-manga-curta-jl527",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/rashguard-gc-blackout-2-0-manga-curta-jl527/",
      name: "Rashguard GC BlackOut 2.0 (manga curta)",
      price: 159.99,
      comparePrice: null,
      description: "A evolução do modelo BlackOut. Tecido preto fosco de alta resistência.",
      images: [
        "/images/products/blackout-mc.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Curta"
    },
    {
      id: "rashguard-gc-sandstorm-manga-curta-1cih2",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/rashguard-gc-sandstorm-manga-curta-1cih2/",
      name: "Rashguard GC Sandstorm (manga curta)",
      price: 159.99,
      comparePrice: null,
      description: "Tonalidade areia. Estilo e proteção, projetado para o jiu-jitsu.",
      images: [
        "/images/products/sandstorm-mc.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Curta"
    },
    {
      id: "rashguard-gc-black-lion-manga-longa-9r44x",
      url: "https://groundculture.lojavirtualnuvem.com.br/produtos/rashguard-gc-black-lion-manga-longa-9r44x/",
      name: "Rashguard GC Black Lion (manga longa)",
      price: 159.99,
      comparePrice: null,
      description: "Versão manga longa da nossa clássica Black Lion. Proteção extra para seus braços no tatame.",
      images: [
        "/images/products/black-lion-ml.webp",
      ],
      variants: ["P", "M", "G", "GG", "XG"],
      category: "Manga Longa"
    }
  ]

};
