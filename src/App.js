import { useState, useMemo, useRef, useEffect } from 'react';
import { local, shared, getDeviceId } from './storage';

// ── Cigar Database ────────────────────────────────────────────────────────────
// Structure: brand -> array of { name, origin, wrapper, vitola (default) }
// Auto-fills the form when a user selects a known cigar name.

export const CIGAR_DB = {
  "Arturo Fuente": [
    { name: "Opus X", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto" },
    { name: "Opus X Perfecxion No. 2", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Opus X Perfecxion No. 5", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Opus X Perfecxion 888", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Lancero" },
    { name: "Opus X Shark", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Belicoso" },
    { name: "Don Carlos", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto" },
    { name: "Don Carlos Eye of the Bull", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Torpedo" },
    { name: "Don Carlos Eye of the Shark", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Belicoso" },
    { name: "Don Carlos Personal Reserve", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto" },
    { name: "Hemingway Short Story", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto" },
    { name: "Hemingway Best Seller", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto" },
    { name: "Hemingway Signature", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto" },
    { name: "Hemingway Classic", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto" },
    { name: "Hemingway Work of Art", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto" },
    { name: "Hemingway Untold Story", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto" },
    { name: "Hemingway Signature Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Perfecto" },
    { name: "Hemingway Classic Sun Grown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto" },
    { name: "Añejo No. 48", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Añejo No. 50", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Añejo No. 55", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Belicoso" },
    { name: "Añejo No. 77 Shark", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Belicoso" },
    { name: "Añejo No. 46", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Corona" },
    { name: "Chateau Fuente", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto" },
    { name: "Chateau Fuente Sun Grown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Chateau Fuente Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Gran Reserva", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Churchill" },
    { name: "Gran Reserva Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Churchill" },
    { name: "8-5-8 Natural", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Lonsdale" },
    { name: "8-5-8 Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Lonsdale" },
    { name: "Rosado Sungrown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Rare Pink", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto" },
    { name: "Especiales Natural", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Lonsdale" },
    { name: "Between The Lines", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Casa Fuente", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto" },
    { name: "Royal Salute Sun Grown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Fuente Fuente OpusX Forbidden Pasion", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto" },
  ],

  "Padrón": [
    { name: "1926 Serie No. 1 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "1926 Serie No. 1 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Churchill" },
    { name: "1926 Serie No. 2 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Belicoso" },
    { name: "1926 Serie No. 2 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Belicoso" },
    { name: "1926 Serie No. 6 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "1926 Serie No. 6 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Toro" },
    { name: "1926 Serie No. 9 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "1926 Serie No. 9 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Robusto" },
    { name: "1926 Serie No. 35 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Corona" },
    { name: "1926 Serie No. 35 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Corona" },
    { name: "1926 Serie 40th Anniversary Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Torpedo" },
    { name: "1926 Serie 40th Anniversary Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Torpedo" },
    { name: "1926 Serie 80th Anniversary Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Perfecto" },
    { name: "1926 Serie 80th Anniversary Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Perfecto" },
    { name: "1964 Anniversary Torpedo Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Torpedo" },
    { name: "1964 Anniversary Torpedo Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Torpedo" },
    { name: "1964 Anniversary Exclusivo Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Box-Pressed Robusto" },
    { name: "1964 Anniversary Exclusivo Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Box-Pressed Robusto" },
    { name: "1964 Anniversary Imperial Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "1964 Anniversary Imperial Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Churchill" },
    { name: "1964 Anniversary Hermoso Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Corona" },
    { name: "Family Reserve No. 45 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Family Reserve No. 45 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Toro" },
    { name: "Family Reserve No. 46 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Family Reserve No. 50 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "Family Reserve No. 85 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Gordo" },
    { name: "Family Reserve No. 95 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Box-Pressed Toro" },
    { name: "Damaso No. 15", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Corona" },
    { name: "Damaso No. 17", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Churchill" },
    { name: "Damaso No. 32", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Series 2000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Series 2000 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Robusto" },
    { name: "Series 3000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Series 3000 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Robusto" },
    { name: "Series 4000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Series 4000 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Toro" },
    { name: "Series 5000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Belicoso" },
    { name: "Series 6000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Torpedo" },
    { name: "Series 6000 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Torpedo" },
    { name: "Series 7000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "Padrón 60th Anniversary", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Gordo" },
  ],

  "Oliva": [
    { name: "Serie V Melanio Figurado", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Figurado" },
    { name: "Serie V Melanio Toro", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Toro" },
    { name: "Serie V Melanio Robusto", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Robusto" },
    { name: "Serie V Melanio Churchill", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Churchill" },
    { name: "Serie V Melanio Lancero", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Lancero" },
    { name: "Serie V Melanio Petite Corona", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Petit Corona" },
    { name: "Serie V Melanio Maduro Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Serie V Melanio Maduro Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
    { name: "Serie V Figurado", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Figurado" },
    { name: "Serie V Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Serie V Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Serie V Lancero", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Lancero" },
    { name: "Serie V Double Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Gordo" },
    { name: "Serie O Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Serie O Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Serie O Churchill", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "Serie O Double Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Gordo" },
    { name: "Serie G Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Master Blends 3", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Connecticut Reserve Robusto", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Robusto" },
    { name: "Connecticut Reserve Toro", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Toro" },
    { name: "Connecticut Reserve Churchill", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Churchill" },
    { name: "Cain F Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Cain Habano", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Cain Maduro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
  ],

  "My Father Cigars": [
    { name: "Le Bijou 1922 Torpedo", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Torpedo" },
    { name: "Le Bijou 1922 Robusto", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Robusto" },
    { name: "Le Bijou 1922 Toro", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Toro" },
    { name: "Le Bijou 1922 Gordo", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Gordo" },
    { name: "Le Bijou 1922 Grand Robusto", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Robusto" },
    { name: "The Judge Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "The Judge Gordo", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "The Judge Gran Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "My Father No. 1", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "My Father No. 2", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "My Father No. 4", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "My Father Flor de Las Antillas Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "My Father Flor de Las Antillas Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "My Father Flor de Las Antillas Gordo", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "La Opulencia Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "La Opulencia Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "El Centurion Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "El Centurion Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
  ],

  "Drew Estate": [
    { name: "Liga Privada No. 9 Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Liga Privada No. 9 Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Liga Privada No. 9 Churchill", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Churchill" },
    { name: "Liga Privada No. 9 Corona Viva", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Corona" },
    { name: "Liga Privada No. 9 Lancero", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Lancero" },
    { name: "Liga Privada T52 Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Liga Privada T52 Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Liga Privada T52 Lancero", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Lancero" },
    { name: "Undercrown Shade Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Undercrown Shade Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Undercrown Shade Gran Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Gordo" },
    { name: "Undercrown Maduro Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Undercrown Maduro Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Undercrown Sun Grown Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Undercrown Sun Grown Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "MUWAT Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "MUWAT Flying Pig", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Perfecto" },
    { name: "Herrera Estelí Robusto Especial", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Herrera Estelí Toro Especial", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Herrera Estelí Norteño Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "20 Acre Farm Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "ACID Kuba Kuba", origin: "Nicaragua", wrapper: "Sumatran", vitola: "Robusto" },
    { name: "ACID Blondie", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Petit Corona" },
    { name: "ACID Toast", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Corona" },
    { name: "ACID 1400cc", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
  ],

  "Davidoff": [
    { name: "Aniversario No. 1", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero" },
    { name: "Aniversario No. 2", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Churchill" },
    { name: "Aniversario No. 3", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Aniversario Special R", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "702 Series Aniversario No. 3", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "702 Series Special R", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "702 Series Special T", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Torpedo" },
    { name: "Winston Churchill Original", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Winston Churchill Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Winston Churchill Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Winston Churchill The Late Hour", origin: "Dominican Republic", wrapper: "Oscuro Maduro", vitola: "Toro" },
    { name: "Signature No. 1", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero" },
    { name: "Signature No. 2", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Panatela" },
    { name: "Signature 2000", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Petit Corona" },
    { name: "Nicaragua Robusto", origin: "Dominican Republic", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Nicaragua Toro", origin: "Dominican Republic", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Nicaragua Box-Pressed Robusto", origin: "Dominican Republic", wrapper: "Habano Nicaragua", vitola: "Box-Pressed Robusto" },
    { name: "Escurio Robusto", origin: "Dominican Republic", wrapper: "Brazilian Mata Fina", vitola: "Robusto" },
    { name: "Escurio Gran Toro", origin: "Dominican Republic", wrapper: "Brazilian Mata Fina", vitola: "Gordo" },
    { name: "Yamasá Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Yamasá Churchill", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Millennium Blend Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Millennium Blend Toro", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
  ],

  "Ashton": [
    { name: "VSG Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "VSG Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "VSG Churchill", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "VSG Torpedo", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Torpedo" },
    { name: "VSG Wizard", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Figurado" },
    { name: "ESG Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Cabinet Selection No. 1", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Churchill" },
    { name: "Cabinet Selection No. 2", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Toro" },
    { name: "Cabinet Selection No. 6", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Lonsdale" },
    { name: "Cabinet Selection No. 8", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Corona" },
    { name: "Heritage Robusto", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Robusto" },
    { name: "Heritage Churchill", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Churchill" },
    { name: "Aged Maduro No. 10", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Churchill" },
    { name: "Aged Maduro No. 20", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Aged Maduro No. 40", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Classic No. 20", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Toro" },
    { name: "Classic Robusto", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Robusto" },
    { name: "Classic Churchill", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Churchill" },
  ],

  "Rocky Patel": [
    { name: "Vintage 1990 Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Vintage 1990 Toro", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Vintage 1992 Robusto", origin: "Honduras", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Vintage 1992 Toro", origin: "Honduras", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Vintage 1999 Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "The Edge Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "The Edge Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "The Edge Maduro Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Fifteenth Anniversary Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Fifteenth Anniversary Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "A.L.R. Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "A.L.R. Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Sun Grown Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Sun Grown Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "1961 Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Hamlet 2000 Toro", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Number 6 Toro", origin: "Honduras", wrapper: "Corojo Honduras", vitola: "Toro" },
  ],

  "AJ Fernandez": [
    { name: "New World Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "New World Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
    { name: "New World Churchill", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Churchill" },
    { name: "New World Connecticut Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Enclave Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Enclave Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Enclave Churchill", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Bellas Artes Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Bellas Artes Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "San Lotano Oval Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "San Lotano Connecticut Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Last Call Robusto", origin: "Nicaragua", wrapper: "Pennsylvania Broadleaf Maduro", vitola: "Robusto" },
    { name: "Last Call Toro", origin: "Nicaragua", wrapper: "Pennsylvania Broadleaf Maduro", vitola: "Toro" },
    { name: "Aging Room Quattro Nicaragua Sonata", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Concerto" },
    { name: "Aging Room Quattro F55 Maestro", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Toro" },
  ],

  "Perdomo": [
    { name: "10th Anniversary Champagne Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "10th Anniversary Champagne Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "10th Anniversary Maduro Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "10th Anniversary Maduro Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
    { name: "Lot 23 Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Lot 23 Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Reserve Champagne Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Reserve Sun Grown Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Reserve Maduro Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Habano Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Habano Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Perdomo 20th Anniversary Connecticut", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Perdomo 20th Anniversary Sun Grown", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Perdomo 20th Anniversary Maduro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
  ],

  "Aganorsa Leaf": [
    { name: "Supreme Leaf Robusto", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto" },
    { name: "Supreme Leaf Toro", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro" },
    { name: "Aniversario Connecticut Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Aniversario Habano Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Swamp Thang Lancero", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Lancero" },
    { name: "Swamp Thang Toro", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro" },
    { name: "JFR Lunatic Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "JFR Lunatic Gordo", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Gordo" },
    { name: "Rare & Limitada", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto" },
  ],

  "Crowned Heads": [
    { name: "Four Kicks Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Four Kicks Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Four Kicks Churchill", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Four Kicks Lonsdale", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Lonsdale" },
    { name: "Four Kicks Maduro Robusto", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Headley Grange Robusto", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Robusto" },
    { name: "Headley Grange Toro", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Toro" },
    { name: "Headley Grange Lancero", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Lancero" },
    { name: "Jericho Hill OBS", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Jericho Hill Willy Lee", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Gordo" },
    { name: "Jericho Hill LBV", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Lancero" },
    { name: "Las Calaveras Robusto", origin: "Honduras", wrapper: "Cameroon", vitola: "Robusto" },
    { name: "Las Calaveras Toro", origin: "Honduras", wrapper: "Cameroon", vitola: "Toro" },
    { name: "The Angel's Anvil Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "The Angel's Anvil Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "J.D. Howard Reserve Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Le Careme Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Juarez Robusto", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Robusto" },
  ],

  "Tatuaje": [
    { name: "Reserva SW Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Reserva SW Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Black Label Miami Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Black Label Miami Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Tattoo Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "La Verite Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Miami Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Monster Series Frank", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Perfecto" },
    { name: "Pork Torpedo", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Torpedo" },
    { name: "10th Anniversary Capa Especial", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Lonsdale" },
  ],

  "Illusione": [
    { name: "~88~", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto" },
    { name: "~888~", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro" },
    { name: "Singulares", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Petit Corona" },
    { name: "Fume d'Amour", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Lancero" },
    { name: "Epernay", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Churchill" },
    { name: "Rothchildes", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Rothschild" },
    { name: "Holy Lance", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Lancero" },
    { name: "MDHK", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto" },
    { name: "Cruzados", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro" },
    { name: "Original Documents MX2", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Garagiste", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto" },
    { name: "Group of Five Robusto", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Robusto" },
  ],

  "RoMa Craft Tobac": [
    { name: "CroMagnon Anthropus", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "CroMagnon Cranium", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Churchill" },
    { name: "CroMagnon EMH Fomorian", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Gordo" },
    { name: "Intemperance EC18 Injustice", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Intemperance BA XXI Gluttony", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Neanderthal SGP", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Torpedo" },
    { name: "Maestranza Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Porthos Gran Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
  ],

  "E.P. Carrillo": [
    { name: "Encore Celestial Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Encore Majestic", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Toro" },
    { name: "La Historia EH Robusto", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Robusto" },
    { name: "La Historia E-III Toro", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Toro" },
    { name: "Pledge Apogee Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Pledge Prequel Toro", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "New Wave Connecticut Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Inch No. 64 Gordo", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Gordo" },
    { name: "Inch Maduro No. 64", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Gordo" },
    { name: "Allegiance Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Allegiance Confidant Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
  ],

  "Warped Cigars": [
    { name: "El Oso Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "El Oso Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Chinchalle", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "La Colmena No. 44", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Petit Corona" },
    { name: "Sky Flower", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero" },
    { name: "Futuro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Maestro del Tiempo 6102", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Señor Esteli", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
  ],

  "Caldwell Cigar Co.": [
    { name: "Long Live the King Robusto", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto" },
    { name: "Long Live the King Toro", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Toro" },
    { name: "Long Live the Queen Toro", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Toro" },
    { name: "Eastern Standard Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Eastern Standard Midnight Express", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "All Out Kings Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "The King is Dead Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Anastasia Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro" },
  ],

  "Plasencia": [
    { name: "Alma Fuerte Robustus Magnus", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Alma Fuerte Toro Quinto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Alma Fuerte Churchill El Gran Conde", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "Alma Fuerte Nestor IV", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Gordo" },
    { name: "Alma del Campo Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Cosecha 149 Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Cosecha 151 Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro" },
    { name: "Reserva Original Robusto", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto" },
    { name: "Reserva Original Toro", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro" },
  ],

  "Joya de Nicaragua": [
    { name: "Antaño 1970 Robusto", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Robusto" },
    { name: "Antaño 1970 Churchill", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Churchill" },
    { name: "Antaño Gran Consul", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Churchill" },
    { name: "Clasico Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Clasico Churchill", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill" },
    { name: "Cabinetta Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Joya Red Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto" },
    { name: "Joya Black Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
    { name: "Joya Silver Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
  ],

  "La Flor Dominicana": [
    { name: "Andalusian Bull", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto" },
    { name: "Double Ligero DL 700 Torpedo", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Torpedo" },
    { name: "Double Ligero DL 654 Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Aire Fresco Lancero", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero" },
    { name: "Ligero Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Ligero Cabinet Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "El Jocko Loco Toro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Cameroon Cabinet Robusto", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto" },
  ],

  "Alec Bradley": [
    { name: "Prensado Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Prensado Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Prensado Gran Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "American Classic Robusto", origin: "Honduras", wrapper: "Connecticut Shade", vitola: "Robusto" },
    { name: "American Classic Toro", origin: "Honduras", wrapper: "Connecticut Shade", vitola: "Toro" },
    { name: "Medalist Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Black Market Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Black Market Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Black Market Filthy Hooligan", origin: "Honduras", wrapper: "Barber Pole (Candela / Maduro)", vitola: "Toro" },
    { name: "Tempus Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
  ],

  "Camacho": [
    { name: "American Barrel-Aged Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "Corojo Robusto", origin: "Honduras", wrapper: "Corojo Honduras", vitola: "Robusto" },
    { name: "Corojo Churchill", origin: "Honduras", wrapper: "Corojo Honduras", vitola: "Churchill" },
    { name: "Ecuador Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Ecuador Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Triple Maduro Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "BXP Robusto", origin: "Honduras", wrapper: "Corojo Honduras", vitola: "Box-Pressed Robusto" },
    { name: "Liberty Series", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
  ],

  "Macanudo": [
    { name: "Café Hyde Park", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Churchill" },
    { name: "Café Prince of Wales", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lonsdale" },
    { name: "Café Portofino", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero" },
    { name: "Café Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Café Gigante", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Gordo" },
    { name: "Inspirado White Connecticut Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Inspirado Orange Habano Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Inspirado Black Oscuro Robusto", origin: "Dominican Republic", wrapper: "Habano Oscuro", vitola: "Robusto" },
    { name: "Inspirado Green Candela Robusto", origin: "Dominican Republic", wrapper: "Candela", vitola: "Robusto" },
    { name: "Montecristo No. 2", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Torpedo" },
  ],

  "Montecristo (Cuban)": [
    { name: "No. 2", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Torpedo" },
    { name: "No. 4", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Petit Corona" },
    { name: "Edmundo", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Open Eagle", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "Linea 1935 Dumas", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Linea 1935 Leyenda", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Perfecto" },
    { name: "Petit Edmundo", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Robusto" },
  ],

  "Cohiba (Cuban)": [
    { name: "Siglo VI", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "Siglo I", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Petit Corona" },
    { name: "Siglo II", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Corona" },
    { name: "Siglo III", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Lonsdale" },
    { name: "Siglo IV", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Siglo V", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Behike 52", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Behike 54", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Behike 56", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "Robustos", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Esplendidos", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Churchill" },
    { name: "Lanceros", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Lancero" },
  ],

  "Dunbarton Tobacco & Trust": [
    { name: "Sin Compromiso Seleccion No. 11", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Sobremesa Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Sobremesa Brûlée", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Red Meat Lovers Club Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "Todos Las Dias Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Muestra de Saka Nacatamale", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
  ],

  "Espinosa Cigars": [
    { name: "Las 6 Provincias Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "601 Blue Label Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "601 Red Label Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "601 La Bomba Atomic Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
    { name: "Crema No. 7 Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
    { name: "Laranja Reserva Robusto", origin: "Nicaragua", wrapper: "Brazilian Mata Fina", vitola: "Robusto" },
  ],

  "ADVentura": [
    { name: "The Navigator Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Royal Return King Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "The Explorer Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Barbarroja's Invasion Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Blue Eyed Jack's Revenge Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
  ],

  "CAO": [
    { name: "Flathead V660 Big Block", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "Flathead V554 Carb", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Brazilia Gol!", origin: "Brazil", wrapper: "Brazilian Mata Fina", vitola: "Toro" },
    { name: "America Toro", origin: "Nicaragua", wrapper: "Barber Pole (Candela / Maduro)", vitola: "Toro" },
    { name: "MX2 Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Guatemala Maduro Robusto", origin: "Honduras", wrapper: "San Andrés Maduro", vitola: "Robusto" },
    { name: "Consigliere Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Cameroon Robusto", origin: "Honduras", wrapper: "Cameroon", vitola: "Robusto" },
  ],

  "Leaf by Oscar": [
    { name: "2012 Habano Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "2012 Connecticut Toro", origin: "Honduras", wrapper: "Ecuador Connecticut Shade", vitola: "Toro" },
    { name: "2012 Maduro Toro", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
    { name: "Sumatra Toro", origin: "Honduras", wrapper: "Ecuador Sumatra", vitola: "Toro" },
    { name: "Maduro Toro Rustico", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro" },
  ],

  "Asylum": [
    { name: "13 Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "13 Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "13 Gordo", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Gordo" },
    { name: "Ogre Robusto", origin: "Honduras", wrapper: "Barber Pole (Habano / Candela)", vitola: "Robusto" },
    { name: "Schizo Connecticut Robusto", origin: "Honduras", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto" },
  ],

  "Viaje": [
    { name: "Exclusivo Florida Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "Zombie Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto" },
    { name: "White Label Project WLP 15", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro" },
    { name: "Brotherhood Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto" },
    { name: "TORO TORO TORO Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro" },
  ],
};

// ── Constants ─────────────────────────────────────────────────────────────────

const WRAPPER_TYPES = [
  "Connecticut Shade","Connecticut Broadleaf","Connecticut Broadleaf Maduro","Ecuador Connecticut Shade","Connecticut Habano",
  "Habano","Habano Ecuador","Habano Nicaragua","Habano Oscuro","Habano Rosado","Habano San Andrés",
  "Corojo","Corojo Honduras","Corojo Nicaragua","Corojo Oscuro",
  "Criollo","Criollo Nicaragua","Criollo '98","Corojo '99",
  "Maduro","San Andrés Maduro","Brazilian Mata Fina Maduro","Pennsylvania Broadleaf Maduro","Oscuro Maduro",
  "Sumatra","Ecuador Sumatra","Indonesian Sumatra",
  "San Andrés (Mexican)","Brazilian Mata Fina","Cameroon","Cameroon Shade","Dominican","Nicaraguan Puro","Ecuadorian",
  "Candela","Natural","Claro","Colorado Claro","Colorado","Colorado Maduro","Oscuro","Double Maduro","Rosado",
  "Barber Pole (Candela / Maduro)","Barber Pole (Habano / Connecticut)","Barber Pole (Habano / Candela)","Triple Wrap",
];

const BRANDS = Object.keys(CIGAR_DB).sort().concat([
  "Padrón (Nicaragua)","Romeo y Julieta (Cuban)","Romeo y Julieta (Dominican)","Partagás (Cuban)",
  "H. Upmann (Cuban)","H. Upmann (Dominican)","Bolivar (Cuban)","Hoyo de Monterrey (Cuban)","Punch (Cuban)",
  "Montecristo (Dominican)","General Cigar Co.","La Aurora","West Tampa Tobacco","Balmoral",
  "Punch (Honduras)","Hoyo de Monterrey (Honduras)","Camacho (Honduras)",
  "Protocol","La Gloria Cubana","Nomad Cigar Co.","Nub","Emilio Cigars",
  "Quesada Cigars","Kristoff","Gurkha","ACID (Drew Estate)","Baccarat","Tatiana",
  "Privada Cigar Club","Domain Cigars","El Mago Cigars","Avowed Cigars","Apostate Cigars",
  "Wildfire Cigar Co.","Tradecraft Cigars","Deadwood Cigars","CroMagnon","Craft Maquette",
  "Fumero","Villiger","Mombacho","Matilde","CAIN","601","Gran Habano","Partagas (Dominican)",
  "Oscar Valladares","San Cristobal","Man O' War","Nub","Powstanie","La Flor Dominicana",
].filter(b => !CIGAR_DB[b]));

const ORIGINS = ["Nicaragua","Dominican Republic","Honduras","Cuba","Ecuador","Brazil","Mexico","Panama","USA","Cameroon","Indonesia","Peru","Colombia","Costa Rica","Bolivia","Multi-Country"];

const VITOLAS = [
  "Robusto","Toro","Churchill","Lancero","Belicoso","Torpedo","Gordo","Petit Corona","Corona","Panatela",
  "Presidente","Diadema","Perfecto","Figurado","Culebra","Double Corona","Gran Corona","Short Robusto",
  "Rothschild","Corona Extra","Lonsdale","Gran Toro","Magnum","Apollo","Concerto","Epicure",
  "Short Perfecto","Box-Pressed Toro","Box-Pressed Robusto","Salomon","Gran Pirámide",
];

const FLAVOR_TAGS = ["Cedar","Earth","Pepper","Leather","Coffee","Cream","Nuts","Cocoa","Fruit","Floral","Spice","Toast","Honey","Herbal","Molasses","Dark Chocolate","Licorice","Raisin","Vanilla","Caramel","Cinnamon","Oak","Hay","Bread","Grass","Mineral"];
const STATUSES = ["In Humidor","Smoked","Wishlist"];

// Seed the cigar repo from our local database on first load
function buildSeedRepo() {
  const repo = {};
  for (const [brand, cigars] of Object.entries(CIGAR_DB)) {
    repo[brand] = cigars.map(c => c.name);
  }
  return repo;
}

const BLOCKLIST = ["fuck","shit","bitch","cunt","dick","cock","pussy","nigger","nigga","faggot","fag","retard","spic","kike","chink","whore","slut","rape","nazi","hitler"];

function filterName(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: "Name cannot be empty." };
  if (trimmed.length < 2) return { ok: false, reason: "Name is too short." };
  if (trimmed.length > 120) return { ok: false, reason: "Name is too long (max 120 chars)." };
  if (!/[a-zA-Z]/.test(trimmed)) return { ok: false, reason: "Name must contain at least one letter." };
  if (/https?:\/\/|<[^>]+>|javascript:/i.test(trimmed)) return { ok: false, reason: "Name contains invalid content." };
  const lower = trimmed.toLowerCase();
  for (const word of BLOCKLIST) {
    if (lower.includes(word)) return { ok: false, reason: "Name contains prohibited content." };
  }
  return { ok: true, value: trimmed };
}

function iqrAvg(vals) {
  if (!vals.length) return 0;
  if (vals.length < 4) return vals.reduce((a, b) => a + b, 0) / vals.length;
  const s = [...vals].sort((a, b) => a - b);
  const q1 = s[Math.floor(s.length * 0.25)], q3 = s[Math.floor(s.length * 0.75)], iqr = q3 - q1;
  const f = s.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
  return f.reduce((a, b) => a + b, 0) / f.length;
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const C = {
  bg:"#0d0d0d", surface:"#1a1a1a", card:"#222222", border:"#3a3a3a",
  accent:"#f26b1d", accentDim:"#b84e10", text:"#f0f0f0", textMuted:"#a0a0a0",
  textDim:"#555555", success:"#52b060", danger:"#c04040", warn:"#c0943a",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;background:${C.bg};}
  .app{font-family:'Lato',sans-serif;font-weight:700;color:${C.text};background:${C.bg};min-height:100vh;}
  .header{background:${C.surface};border-bottom:1.5px solid ${C.border};padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
  .header-title{font-family:'Playfair Display',serif;font-weight:700;font-size:21px;color:${C.accent};}
  .header-sub{font-size:11px;color:${C.textMuted};font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px;}
  .nav{display:flex;gap:4px;}
  .nav-btn{background:none;border:1.5px solid transparent;color:${C.textMuted};padding:6px 14px;border-radius:6px;cursor:pointer;font-family:'Lato',sans-serif;font-weight:700;font-size:12px;transition:all 0.15s;}
  .nav-btn:hover{color:${C.text};border-color:${C.border};}
  .nav-btn.active{color:${C.accent};border-color:${C.accentDim};background:${C.card};}
  .content{padding:14px 20px;max-width:900px;margin:0 auto;}
  .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
  @media(min-width:600px){.stats-grid{grid-template-columns:repeat(6,1fr);}}
  .stat-card{background:${C.surface};border:1.5px solid ${C.border};border-radius:8px;padding:10px 12px;}
  .stat-label{font-size:9px;color:${C.textMuted};text-transform:uppercase;letter-spacing:1px;font-weight:900;}
  .stat-value{font-family:'Playfair Display',serif;font-weight:700;font-size:22px;color:${C.accent};margin-top:2px;line-height:1;}
  .stat-sub{font-size:10px;color:${C.textDim};font-weight:700;margin-top:2px;}
  .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
  .section-title{font-family:'Playfair Display',serif;font-weight:700;font-size:16px;color:${C.text};}
  .btn-primary{background:${C.accent};color:#110900;border:none;padding:7px 16px;border-radius:6px;cursor:pointer;font-family:'Lato',sans-serif;font-size:12px;font-weight:900;transition:opacity 0.15s;}
  .btn-primary:hover{opacity:0.85;}
  .btn-primary:disabled{opacity:0.4;cursor:not-allowed;}
  .btn-ghost{background:none;border:1.5px solid ${C.border};color:${C.textMuted};padding:6px 13px;border-radius:6px;cursor:pointer;font-family:'Lato',sans-serif;font-size:12px;font-weight:700;transition:all 0.15s;}
  .btn-ghost:hover{border-color:${C.accentDim};color:${C.accent};}
  .cigar-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;}
  .cigar-card{background:${C.card};border:1.5px solid ${C.border};border-radius:10px;overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.15s;}
  .cigar-card:hover{border-color:${C.accentDim};}
  .cigar-photo{width:100%;height:100px;object-fit:cover;display:block;cursor:pointer;}
  .photo-placeholder{width:100%;height:100px;background:${C.surface};display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;border-bottom:1px solid ${C.border};gap:4px;transition:background 0.15s;}
  .photo-placeholder:hover{background:${C.bg};}
  .photo-hint{font-size:10px;color:${C.textDim};font-weight:700;}
  .cigar-body{padding:10px 12px;flex:1;display:flex;flex-direction:column;}
  .cigar-name-line{font-family:'Playfair Display',serif;font-weight:700;font-size:14px;color:${C.accent};line-height:1.2;}
  .cigar-sub-line{font-size:11px;color:${C.textMuted};font-weight:700;margin-top:1px;}
  .cigar-meta{margin-top:8px;display:flex;flex-direction:column;gap:3px;}
  .meta-row{display:flex;justify-content:space-between;font-size:11px;}
  .meta-lbl{color:${C.textDim};font-weight:700;}
  .meta-val{color:${C.text};font-weight:700;}
  .status-pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:900;letter-spacing:0.8px;text-transform:uppercase;margin-top:7px;align-self:flex-start;}
  .s-in{background:#1a3a20;color:#5ab870;}
  .s-smoked{background:#2a1a08;color:${C.accentDim};}
  .s-wish{background:#1a1a30;color:#7070d0;}
  .qty-chip{background:${C.surface};border:1.5px solid ${C.border};color:${C.textMuted};font-size:10px;font-weight:900;padding:1px 7px;border-radius:4px;margin-left:6px;vertical-align:middle;}
  .card-del{background:none;border:none;color:${C.textDim};font-size:10px;font-weight:700;cursor:pointer;margin-top:6px;padding:0;align-self:flex-start;transition:color 0.12s;}
  .card-del:hover{color:${C.danger};}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.82);display:flex;align-items:flex-end;justify-content:center;z-index:100;}
  @media(min-width:600px){.modal-overlay{align-items:center;}}
  .modal{background:${C.surface};border:1.5px solid ${C.border};border-radius:12px 12px 0 0;padding:20px;width:100%;max-width:520px;max-height:92vh;overflow-y:auto;}
  @media(min-width:600px){.modal{border-radius:12px;}}
  .modal-title{font-family:'Playfair Display',serif;font-weight:700;font-size:18px;color:${C.accent};margin-bottom:14px;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .fg{display:flex;flex-direction:column;gap:4px;}
  .fg.full{grid-column:1/-1;}
  .form-label{font-size:10px;color:${C.textMuted};text-transform:uppercase;letter-spacing:0.8px;font-weight:900;}
  .form-input{background:${C.card};border:1.5px solid ${C.border};color:${C.text};padding:9px 10px;border-radius:6px;font-family:'Lato',sans-serif;font-size:14px;font-weight:700;outline:none;transition:border-color 0.15s;width:100%;-webkit-appearance:none;}
  .form-input:focus{border-color:${C.accentDim};}
  .form-input option{background:${C.card};}
  .form-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;}
  .flavor-tags{display:flex;flex-wrap:wrap;gap:5px;}
  .ftag{padding:5px 10px;border-radius:20px;font-size:11px;font-weight:900;cursor:pointer;border:1.5px solid ${C.border};color:${C.textMuted};background:${C.card};transition:all 0.12s;}
  .ftag.sel{background:${C.accentDim};border-color:${C.accent};color:${C.accent};}
  .stars{display:flex;gap:4px;}
  .star{font-size:22px;cursor:pointer;color:${C.border};transition:color 0.1s;}
  .star.lit{color:${C.accent};}
  .log-list{display:flex;flex-direction:column;gap:8px;}
  .log-card{background:${C.card};border:1.5px solid ${C.border};border-radius:10px;padding:12px 14px;}
  .log-top{display:flex;justify-content:space-between;align-items:flex-start;}
  .log-cigar{font-family:'Playfair Display',serif;font-weight:700;font-size:14px;color:${C.accent};}
  .log-date{font-size:10px;color:${C.textDim};font-weight:700;margin-top:1px;}
  .log-notes{font-size:11px;color:${C.textMuted};margin-top:7px;font-style:italic;line-height:1.5;}
  .log-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px;}
  .log-tag{padding:2px 7px;border-radius:20px;font-size:10px;font-weight:900;background:${C.surface};color:${C.textMuted};border:1.5px solid ${C.border};}
  .empty-state{text-align:center;padding:48px 20px;color:${C.textDim};}
  .empty-text{font-family:'Playfair Display',serif;font-size:15px;color:${C.textMuted};}
  .empty-sub{font-size:11px;font-weight:700;margin-top:5px;}
  .divider{border:none;border-top:1.5px solid ${C.border};margin:12px 0;}
  .filter-row{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;}
  .fchip{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:900;cursor:pointer;border:1.5px solid ${C.border};color:${C.textMuted};background:none;font-family:'Lato',sans-serif;transition:all 0.12px;}
  .fchip.active{background:${C.card};border-color:${C.accentDim};color:${C.accent};}
  .price-ok{color:${C.success};}
  .ins-bar-bg{flex:1;background:${C.surface};border-radius:4px;height:10px;border:1px solid ${C.border};}
  .ins-bar{background:${C.accentDim};height:10px;border-radius:4px;}
  input[type=range]{accent-color:${C.accent};width:100%;}
  .pool-badge{font-size:9px;font-weight:900;color:${C.accentDim};}
  .name-wrap{position:relative;}
  .suggestions{position:absolute;top:100%;left:0;right:0;background:${C.card};border:1.5px solid ${C.accentDim};border-top:none;border-radius:0 0 8px 8px;z-index:20;max-height:180px;overflow-y:auto;}
  .suggestion-item{padding:10px 12px;font-size:13px;font-weight:700;cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:${C.text};}
  .suggestion-item:hover{background:${C.surface};}
  .suggestion-new{color:${C.accent};}
  .community-badge{font-size:9px;font-weight:900;color:${C.textDim};padding:1px 5px;border:1px solid ${C.border};border-radius:3px;}
  .verified-badge{font-size:9px;font-weight:900;color:#52b060;padding:1px 5px;border:1px solid #52b060;border-radius:3px;}
  .new-badge{font-size:9px;font-weight:900;color:${C.accentDim};padding:1px 5px;border:1px solid ${C.accentDim};border-radius:3px;}
  .filter-err{font-size:10px;color:${C.danger};font-weight:700;margin-top:3px;}
  .flag-btn{background:none;border:none;color:${C.textDim};font-size:10px;font-weight:700;cursor:pointer;padding:0;margin-left:8px;transition:color 0.12s;}
  .flag-btn:hover{color:${C.warn};}
  .toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:${C.surface};border:1.5px solid ${C.border};color:${C.text};padding:10px 20px;border-radius:8px;font-size:12px;font-weight:700;z-index:200;pointer-events:none;white-space:nowrap;}
  .autofill-badge{font-size:9px;color:${C.success};font-weight:900;margin-left:6px;}
  .device-id{font-size:9px;color:${C.textDim};font-weight:700;margin-top:2px;font-family:monospace;}
`;

// ── App ────────────────────────────────────────────────────────────────────────

const EMPTY_CIGAR_FORM = {brand:"",vitola:"Robusto",origin:"Nicaragua",wrapper:"Connecticut Shade",qty:1,cost:"",msrp:"",status:"In Humidor",acquired:new Date().toISOString().slice(0,10)};
const EMPTY_LOG_FORM = {cigarId:"",date:new Date().toISOString().slice(0,10),rating:8,draw:8,burn:8,flavors:[],notes:""};

export default function App() {
  const deviceId = useMemo(() => getDeviceId(), []);

  const [tab, setTab] = useState("collection");
  const [filter, setFilter] = useState("All");
  const [showAddCigar, setShowAddCigar] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);
  const [toast, setToast] = useState(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const [cigars, setCigarsRaw] = useState(() => local.get('cigars') || []);
  const [logs, setLogsRaw] = useState(() => local.get('logs') || []);
  const [cigarRepo, setCigarRepoRaw] = useState(() => {
    const seed = buildSeedRepo();
    const saved = shared.get('cigar_repo') || {};
    const merged = { ...seed };
    for (const brand in saved) {
      merged[brand] = Array.from(new Set([...(merged[brand] || []), ...saved[brand]]));
    }
    return merged;
  });
  const [sharedMsrp, setSharedMsrpRaw] = useState(() => shared.get('msrp_pool') || {});

  function setCigars(v) { const val = typeof v === 'function' ? v(cigars) : v; setCigarsRaw(val); local.set('cigars', val); }
  function setLogs(v) { const val = typeof v === 'function' ? v(logs) : v; setLogsRaw(val); local.set('logs', val); }
  function setCigarRepo(v) { const val = typeof v === 'function' ? v(cigarRepo) : v; setCigarRepoRaw(val); shared.set('cigar_repo', val); }
  function setSharedMsrp(v) { const val = typeof v === 'function' ? v(sharedMsrp) : v; setSharedMsrpRaw(val); shared.set('msrp_pool', val); }

  const [nameInput, setNameInput] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [nameError, setNameError] = useState("");
  const [cigarForm, setCigarForm] = useState(EMPTY_CIGAR_FORM);
  const [logForm, setLogForm] = useState(EMPTY_LOG_FORM);
  const fileRefs = useRef({});

  useEffect(() => {
    const brand = cigarForm.brand;
    if (!brand || !nameInput.trim()) { setNameSuggestions([]); return; }
    const pool = cigarRepo[brand] || [];
    const q = nameInput.toLowerCase();
    setNameSuggestions(pool.filter(n => n.toLowerCase().includes(q)).slice(0, 10));
  }, [nameInput, cigarForm.brand, cigarRepo]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  // Auto-fill form fields when a known cigar name is selected
  function applyAutoFill(brand, cigarName) {
    const brandCigars = CIGAR_DB[brand] || [];
    const match = brandCigars.find(c => c.name.toLowerCase() === cigarName.toLowerCase());
    if (match) {
      setCigarForm(prev => ({
        ...prev,
        vitola: match.vitola || prev.vitola,
        origin: match.origin || prev.origin,
        wrapper: match.wrapper || prev.wrapper,
      }));
      setAutoFilled(true);
    } else {
      setAutoFilled(false);
    }
  }

  function selectSuggestion(name) {
    setNameInput(name);
    setShowSuggestions(false);
    applyAutoFill(cigarForm.brand, name);
  }

  function submitNameToRepo(name, brand) {
    const check = filterName(name);
    if (!check.ok) { setNameError(check.reason); return null; }
    setNameError("");
    const cleanName = check.value;
    const existing = (cigarRepo[brand] || []).map(n => n.toLowerCase());
    if (!existing.includes(cleanName.toLowerCase())) {
      setCigarRepo(prev => ({ ...prev, [brand]: [...(prev[brand] || []), cleanName] }));
      showToast(`"${cleanName}" added to community repo.`);
    }
    return cleanName;
  }

  function flagName(brand, name) {
    const flags = shared.get('cigar_flags') || [];
    if (!flags.find(f => f.brand === brand && f.name === name)) {
      flags.push({ brand, name, ts: Date.now() });
      shared.set('cigar_flags', flags);
    }
    showToast(`"${name}" flagged for review. Thank you.`);
  }

  function contributeToPool(cigar) {
    if (!cigar.msrp || cigar.msrp <= 0) return;
    const key = `${cigar.brand}||${cigar.vitola}`;
    setSharedMsrp(prev => {
      const pool = { ...prev };
      if (!pool[key]) pool[key] = [];
      if (!pool[key].includes(cigar.msrp)) pool[key] = [...pool[key], cigar.msrp];
      return pool;
    });
  }

  const allMsrpValues = useMemo(() => [
    ...cigars.filter(c => c.msrp > 0).map(c => c.msrp),
    ...Object.values(sharedMsrp).flat()
  ], [cigars, sharedMsrp]);

  const costVals = useMemo(() => cigars.filter(c => c.cost > 0).map(c => c.cost), [cigars]);
  const avgMsrp = iqrAvg(allMsrpValues);
  const avgCost = iqrAvg(costVals);
  const humidorCount = cigars.filter(c => c.status === "In Humidor").reduce((a, c) => a + c.qty, 0);
  const totalSmoked = cigars.filter(c => c.status === "Smoked").length;
  const wishlistCount = cigars.filter(c => c.status === "Wishlist").length;
  const avgRating = logs.length ? (logs.reduce((a, l) => a + l.rating, 0) / logs.length).toFixed(1) : "—";
  const filteredCigars = useMemo(() => filter === "All" ? cigars : cigars.filter(c => c.status === filter), [cigars, filter]);

  function addCigar() {
    const cleanName = submitNameToRepo(nameInput, cigarForm.brand);
    if (!cleanName) return;
    const newCigar = { ...cigarForm, id: Date.now(), name: cleanName, cost: parseFloat(cigarForm.cost) || 0, msrp: parseFloat(cigarForm.msrp) || 0, qty: parseInt(cigarForm.qty) || 1, photo: null };
    setCigars(p => [...p, newCigar]);
    contributeToPool(newCigar);
    setShowAddCigar(false);
    setNameInput(""); setNameError(""); setAutoFilled(false);
    setCigarForm(EMPTY_CIGAR_FORM);
  }

  function addLog() {
    setLogs(p => [...p, { ...logForm, id: Date.now(), cigarId: parseInt(logForm.cigarId) }]);
    setShowAddLog(false);
    setLogForm(EMPTY_LOG_FORM);
  }

  const getCigar = id => cigars.find(c => c.id === id);
  const statusClass = s => s === "In Humidor" ? "s-in" : s === "Smoked" ? "s-smoked" : "s-wish";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div>
            <div className="header-title">CigarHub</div>
            <div className="header-sub">Collection & Tasting Journal</div>
            <div className="device-id">ID: {deviceId.slice(0, 8)}</div>
          </div>
          <nav className="nav">
            {["collection","tasting log","insights"].map(t => (
              <button key={t} className={`nav-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="content">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">In Humidor</div><div className="stat-value">{humidorCount}</div><div className="stat-sub">available</div></div>
            <div className="stat-card"><div className="stat-label">Total Smoked</div><div className="stat-value">{totalSmoked}</div><div className="stat-sub">sticks logged</div></div>
            <div className="stat-card"><div className="stat-label">Wishlist</div><div className="stat-value">{wishlistCount}</div><div className="stat-sub">cigars wanted</div></div>
            <div className="stat-card"><div className="stat-label">Avg Rating</div><div className="stat-value">{avgRating}</div><div className="stat-sub">/ 10</div></div>
            <div className="stat-card">
              <div className="stat-label">Avg MSRP*</div>
              <div className="stat-value">${avgMsrp.toFixed(2)}</div>
              <div className="stat-sub">{allMsrpValues.length} pts <span className="pool-badge">SHARED</span></div>
            </div>
            <div className="stat-card"><div className="stat-label">Avg Cost*</div><div className="stat-value" style={{color:C.success}}>${avgCost.toFixed(2)}</div><div className="stat-sub">what you paid</div></div>
          </div>

          {tab === "collection" && (
            <>
              <div className="section-header">
                <span className="section-title">My Collection</span>
                <button className="btn-primary" onClick={() => { setShowAddCigar(true); setNameInput(""); setNameError(""); setAutoFilled(false); }}>+ Add Cigar</button>
              </div>
              <div className="filter-row">
                {["All","In Humidor","Smoked","Wishlist"].map(f => (
                  <button key={f} className={`fchip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
              </div>
              {filteredCigars.length === 0
                ? <div className="empty-state"><div className="empty-text">No cigars here yet</div><div className="empty-sub">Add your first stick to get started</div></div>
                : <div className="cigar-grid">
                  {filteredCigars.map(c => (
                    <div key={c.id} className="cigar-card">
                      <input type="file" accept="image/*" style={{display:"none"}} ref={el => fileRefs.current[c.id] = el} onChange={e => {
                        const file = e.target.files[0]; if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setCigars(p => p.map(x => x.id === c.id ? {...x, photo: ev.target.result} : x));
                        reader.readAsDataURL(file);
                      }}/>
                      {c.photo
                        ? <img src={c.photo} className="cigar-photo" alt={c.name} onClick={() => fileRefs.current[c.id]?.click()}/>
                        : <div className="photo-placeholder" onClick={() => fileRefs.current[c.id]?.click()}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span className="photo-hint">Upload photo</span>
                          </div>
                      }
                      <div className="cigar-body">
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div><div className="cigar-name-line">{c.name || c.brand}</div><div className="cigar-sub-line">{c.brand} · {c.vitola}</div></div>
                          <span className="qty-chip">×{c.qty}</span>
                        </div>
                        <div className="cigar-meta">
                          <div className="meta-row"><span className="meta-lbl">Origin</span><span className="meta-val">{c.origin}</span></div>
                          <div className="meta-row"><span className="meta-lbl">Wrapper</span><span className="meta-val">{c.wrapper}</span></div>
                          <div className="meta-row"><span className="meta-lbl">Your Cost</span><span className="meta-val price-ok">${c.cost.toFixed(2)}</span></div>
                          <div className="meta-row"><span className="meta-lbl">MSRP</span><span className="meta-val">${c.msrp.toFixed(2)}</span></div>
                          {c.msrp > 0 && c.cost > 0 && <div className="meta-row"><span className="meta-lbl">Savings</span><span className="meta-val price-ok">{Math.round((1 - c.cost / c.msrp) * 100)}%</span></div>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",marginTop:7}}>
                          <span className={`status-pill ${statusClass(c.status)}`}>{c.status}</span>
                        </div>
                        <div style={{display:"flex",gap:10,marginTop:6}}>
                          <button className="card-del" onClick={() => setCigars(p => p.filter(x => x.id !== c.id))}>Remove</button>
                          {c.name && <button className="flag-btn" onClick={() => flagName(c.brand, c.name)}>⚑ Flag name</button>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </>
          )}

          {tab === "tasting log" && (
            <>
              <div className="section-header">
                <span className="section-title">Tasting Notes</span>
                <button className="btn-primary" onClick={() => setShowAddLog(true)}>+ Log a Smoke</button>
              </div>
              {logs.length === 0
                ? <div className="empty-state"><div className="empty-text">No tasting notes yet</div><div className="empty-sub">Log your next smoke</div></div>
                : <div className="log-list">
                  {[...logs].reverse().map(l => {
                    const c = getCigar(l.cigarId);
                    return (
                      <div key={l.id} className="log-card">
                        <div className="log-top">
                          <div>
                            <div className="log-cigar">{c ? `${c.name || c.brand} – ${c.vitola}` : "Unknown"}</div>
                            <div className="log-date">{new Date(l.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontSize:19,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.accent}}>{l.rating}<span style={{fontSize:11,color:C.textDim}}>/10</span></div>
                            <div style={{fontSize:10,color:C.textDim,fontWeight:700}}>Draw {l.draw} · Burn {l.burn}</div>
                          </div>
                        </div>
                        {l.notes && <div className="log-notes">"{l.notes}"</div>}
                        {l.flavors.length > 0 && <div className="log-tags">{l.flavors.map(f => <span key={f} className="log-tag">{f}</span>)}</div>}
                      </div>
                    );
                  })}
                </div>
              }
            </>
          )}

          {tab === "insights" && (
            <>
              <div className="section-header"><span className="section-title">Insights</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {label:`Avg MSRP — ${allMsrpValues.length} shared data points`,val:`$${avgMsrp.toFixed(2)}`,sub:"IQR outlier removal applied",color:C.accent,border:C.accentDim},
                  {label:"Avg Cost You Paid",val:`$${avgCost.toFixed(2)}`,sub:`${costVals.length} cigars with cost data`,color:C.success,border:C.success},
                  ...(avgMsrp>0&&avgCost>0?[{label:"Avg Savings vs MSRP",val:`${((1-avgCost/avgMsrp)*100).toFixed(1)}%`,sub:`$${(avgMsrp-avgCost).toFixed(2)} below retail on avg`,color:"#9090e0",border:"#5050b0"}]:[])
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{borderLeft:`3px solid ${s.border}`}}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value" style={{color:s.color}}>{s.val}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                ))}
                <hr className="divider"/>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:C.text,marginBottom:6}}>Top Origins in Collection</div>
                {Object.entries(cigars.reduce((acc,c)=>{acc[c.origin]=(acc[c.origin]||0)+1;return acc},{})).sort((a,b)=>b[1]-a[1]).map(([o,n]) => (
                  <div key={o} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.textMuted,width:160}}>{o}</div>
                    <div className="ins-bar-bg"><div className="ins-bar" style={{width:`${(n/cigars.length)*100}%`}}/></div>
                    <div style={{fontSize:11,fontWeight:900,color:C.textDim,width:20,textAlign:"right"}}>{n}</div>
                  </div>
                ))}
                {logs.length > 0 && (
                  <>
                    <hr className="divider"/>
                    <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Top Rated Smokes</div>
                    {[...logs].sort((a,b) => b.rating - a.rating).slice(0,3).map(l => {
                      const c = getCigar(l.cigarId);
                      return (
                        <div key={l.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                          <span style={{color:C.text}}>{c ? `${c.name || c.brand} – ${c.vitola}` : "Unknown"}</span>
                          <span style={{color:C.accent,fontFamily:"'Playfair Display',serif"}}>{l.rating}/10</span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {showAddCigar && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddCigar(false)}>
            <div className="modal">
              <div className="modal-title">Add to Collection</div>
              <div className="form-grid">
                <div className="fg full"><label className="form-label">Brand</label>
                  <select className="form-input" value={cigarForm.brand} onChange={e => {
                    setCigarForm(p => ({...EMPTY_CIGAR_FORM, brand: e.target.value}));
                    setNameInput(""); setNameError(""); setAutoFilled(false);
                  }}>
                    <option value="">Select a brand...</option>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>

                <div className="fg full">
                  <label className="form-label">
                    Cigar Name
                    {autoFilled && <span className="autofill-badge">✓ Auto-filled</span>}
                  </label>
                  <div className="name-wrap">
                    <input
                      className="form-input"
                      placeholder={cigarForm.brand ? "Search or enter cigar name..." : "Select a brand first"}
                      disabled={!cigarForm.brand}
                      value={nameInput}
                      onChange={e => { setNameInput(e.target.value); setShowSuggestions(true); setNameError(""); setAutoFilled(false); }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      autoComplete="off"
                    />
                    {showSuggestions && cigarForm.brand && (nameSuggestions.length > 0 || nameInput.trim()) && (
                      <div className="suggestions">
                        {nameSuggestions.map(n => {
                          const isVerified = (CIGAR_DB[cigarForm.brand] || []).some(c => c.name === n);
                          return (
                            <div key={n} className="suggestion-item" onMouseDown={() => selectSuggestion(n)}>
                              <span>{n}</span>
                              <span className={isVerified ? "verified-badge" : "community-badge"}>{isVerified ? "VERIFIED" : "COMMUNITY"}</span>
                            </div>
                          );
                        })}
                        {nameInput.trim() && !nameSuggestions.map(n => n.toLowerCase()).includes(nameInput.trim().toLowerCase()) && (
                          <div className="suggestion-item suggestion-new" onMouseDown={() => setShowSuggestions(false)}>
                            <span>Submit "{nameInput.trim()}" as new</span><span className="new-badge">NEW</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {nameError && <div className="filter-err">{nameError}</div>}
                </div>

                <div className="fg"><label className="form-label">Vitola</label><select className="form-input" value={cigarForm.vitola} onChange={e => setCigarForm(p => ({...p, vitola: e.target.value}))}>{VITOLAS.map(v => <option key={v}>{v}</option>)}</select></div>
                <div className="fg"><label className="form-label">Origin</label><select className="form-input" value={cigarForm.origin} onChange={e => setCigarForm(p => ({...p, origin: e.target.value}))}>{ORIGINS.map(o => <option key={o}>{o}</option>)}</select></div>
                <div className="fg full"><label className="form-label">Wrapper</label><select className="form-input" value={cigarForm.wrapper} onChange={e => setCigarForm(p => ({...p, wrapper: e.target.value}))}>{WRAPPER_TYPES.map(w => <option key={w}>{w}</option>)}</select></div>
                <div className="fg"><label className="form-label">Status</label><select className="form-input" value={cigarForm.status} onChange={e => setCigarForm(p => ({...p, status: e.target.value}))}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="fg"><label className="form-label">Quantity</label><input className="form-input" type="number" min="0" value={cigarForm.qty} onChange={e => setCigarForm(p => ({...p, qty: e.target.value}))}/></div>
                <div className="fg"><label className="form-label">Your Cost ($)</label><input className="form-input" type="number" step="0.01" placeholder="0.00" value={cigarForm.cost} onChange={e => setCigarForm(p => ({...p, cost: e.target.value}))}/></div>
                <div className="fg"><label className="form-label">MSRP ($)</label><input className="form-input" type="number" step="0.01" placeholder="0.00" value={cigarForm.msrp} onChange={e => setCigarForm(p => ({...p, msrp: e.target.value}))}/></div>
                <div className="fg full"><label className="form-label">Date Acquired</label><input className="form-input" type="date" value={cigarForm.acquired} onChange={e => setCigarForm(p => ({...p, acquired: e.target.value}))}/></div>
              </div>
              <div className="form-actions">
                <button className="btn-ghost" onClick={() => setShowAddCigar(false)}>Cancel</button>
                <button className="btn-primary" onClick={addCigar} disabled={!cigarForm.brand || !nameInput.trim()}>Add Cigar</button>
              </div>
            </div>
          </div>
        )}

        {showAddLog && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAddLog(false)}>
            <div className="modal">
              <div className="modal-title">Log a Smoke</div>
              <div className="form-grid">
                <div className="fg full"><label className="form-label">Cigar</label>
                  <select className="form-input" value={logForm.cigarId} onChange={e => setLogForm(p => ({...p, cigarId: e.target.value}))}>
                    <option value="">Select a cigar...</option>
                    {cigars.map(c => <option key={c.id} value={c.id}>{c.name || c.brand} – {c.vitola}</option>)}
                  </select>
                </div>
                <div className="fg full"><label className="form-label">Date</label><input className="form-input" type="date" value={logForm.date} onChange={e => setLogForm(p => ({...p, date: e.target.value}))}/></div>
                <div className="fg full"><label className="form-label">Overall Rating: {logForm.rating}/10</label>
                  <div className="stars">{[...Array(10)].map((_,i) => <span key={i} className={`star${i < logForm.rating ? " lit" : ""}`} onClick={() => setLogForm(p => ({...p, rating: i+1}))}>★</span>)}</div>
                </div>
                <div className="fg"><label className="form-label">Draw: {logForm.draw}/10</label><input type="range" min="1" max="10" step="1" value={logForm.draw} onChange={e => setLogForm(p => ({...p, draw: +e.target.value}))}/></div>
                <div className="fg"><label className="form-label">Burn: {logForm.burn}/10</label><input type="range" min="1" max="10" step="1" value={logForm.burn} onChange={e => setLogForm(p => ({...p, burn: +e.target.value}))}/></div>
                <div className="fg full"><label className="form-label">Flavor Notes</label>
                  <div className="flavor-tags">{FLAVOR_TAGS.map(f => <span key={f} className={`ftag${logForm.flavors.includes(f) ? " sel" : ""}`} onClick={() => setLogForm(p => ({...p, flavors: p.flavors.includes(f) ? p.flavors.filter(x => x !== f) : [...p.flavors, f]}))}>{f}</span>)}</div>
                </div>
                <div className="fg full"><label className="form-label">Notes</label><textarea className="form-input" rows={3} style={{resize:"vertical"}} placeholder="Your impressions..." value={logForm.notes} onChange={e => setLogForm(p => ({...p, notes: e.target.value}))}/></div>
              </div>
              <div className="form-actions">
                <button className="btn-ghost" onClick={() => setShowAddLog(false)}>Cancel</button>
                <button className="btn-primary" onClick={addLog} disabled={!logForm.cigarId}>Save Log</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
