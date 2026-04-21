import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { local, shared, getDeviceId } from './storage';

// ── Cigar Database ────────────────────────────────────────────────────────────
export const CIGAR_DB = {
  "Arturo Fuente": [
    { name: "Opus X", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto", strength: "full" },
    { name: "Opus X Perfecxion No. 2", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "full" },
    { name: "Opus X Perfecxion No. 5", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Opus X Perfecxion 888", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Lancero", strength: "full" },
    { name: "Opus X Shark", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Belicoso", strength: "full" },
    { name: "Don Carlos", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto", strength: "medium-full" },
    { name: "Don Carlos Eye of the Bull", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Torpedo", strength: "medium-full" },
    { name: "Don Carlos Eye of the Shark", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Belicoso", strength: "medium-full" },
    { name: "Don Carlos Personal Reserve", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto", strength: "medium-full" },
    { name: "Hemingway Short Story", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto", strength: "medium" },
    { name: "Hemingway Best Seller", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto", strength: "medium" },
    { name: "Hemingway Signature", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto", strength: "medium" },
    { name: "Hemingway Classic", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto", strength: "medium" },
    { name: "Hemingway Work of Art", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto", strength: "medium" },
    { name: "Hemingway Untold Story", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Perfecto", strength: "medium" },
    { name: "Hemingway Signature Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Perfecto", strength: "medium-full" },
    { name: "Hemingway Classic Sun Grown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto", strength: "medium-full" },
    { name: "Añejo No. 48", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "Añejo No. 50", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "full" },
    { name: "Añejo No. 55", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Belicoso", strength: "full" },
    { name: "Añejo No. 77 Shark", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Belicoso", strength: "full" },
    { name: "Añejo No. 46", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Corona", strength: "full" },
    { name: "Chateau Fuente", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto", strength: "mild-medium" },
    { name: "Chateau Fuente Sun Grown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium" },
    { name: "Chateau Fuente Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "medium" },
    { name: "Gran Reserva", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Churchill", strength: "mild-medium" },
    { name: "Gran Reserva Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Churchill", strength: "medium" },
    { name: "8-5-8 Natural", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Lonsdale", strength: "mild-medium" },
    { name: "8-5-8 Maduro", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Lonsdale", strength: "medium" },
    { name: "Rosado Sungrown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Rare Pink", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto", strength: "medium-full" },
    { name: "Especiales Natural", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Lonsdale", strength: "medium" },
    { name: "Between The Lines", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium-full" },
    { name: "Casa Fuente", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto", strength: "medium" },
    { name: "Royal Salute Sun Grown", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "medium-full" },
    { name: "Fuente Fuente OpusX Forbidden Pasion", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto", strength: "full" },
  ],
  "Padrón": [
    { name: "1926 Serie No. 1 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill", strength: "full" },
    { name: "1926 Serie No. 1 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Churchill", strength: "full" },
    { name: "1926 Serie No. 2 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Belicoso", strength: "full" },
    { name: "1926 Serie No. 2 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Belicoso", strength: "full" },
    { name: "1926 Serie No. 6 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "1926 Serie No. 6 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Toro", strength: "full" },
    { name: "1926 Serie No. 9 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "1926 Serie No. 9 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Robusto", strength: "full" },
    { name: "1926 Serie No. 35 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Corona", strength: "full" },
    { name: "1926 Serie No. 35 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Corona", strength: "full" },
    { name: "1926 Serie 40th Anniversary Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Torpedo", strength: "full" },
    { name: "1926 Serie 40th Anniversary Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Torpedo", strength: "full" },
    { name: "1926 Serie 80th Anniversary Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Perfecto", strength: "full" },
    { name: "1926 Serie 80th Anniversary Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Perfecto", strength: "full" },
    { name: "1964 Anniversary Torpedo Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Torpedo", strength: "medium-full" },
    { name: "1964 Anniversary Torpedo Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Torpedo", strength: "medium-full" },
    { name: "1964 Anniversary Exclusivo Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Box-Pressed Robusto", strength: "medium-full" },
    { name: "1964 Anniversary Exclusivo Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Box-Pressed Robusto", strength: "medium-full" },
    { name: "1964 Anniversary Imperial Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill", strength: "medium-full" },
    { name: "1964 Anniversary Imperial Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Churchill", strength: "medium-full" },
    { name: "1964 Anniversary Hermoso Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Corona", strength: "medium-full" },
    { name: "Family Reserve No. 45 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Family Reserve No. 45 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Toro", strength: "full" },
    { name: "Family Reserve No. 46 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Family Reserve No. 50 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill", strength: "full" },
    { name: "Family Reserve No. 85 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Gordo", strength: "full" },
    { name: "Family Reserve No. 95 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Box-Pressed Toro", strength: "full" },
    { name: "Damaso No. 15", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Corona", strength: "mild-medium" },
    { name: "Damaso No. 17", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Churchill", strength: "mild-medium" },
    { name: "Damaso No. 32", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "mild-medium" },
    { name: "Series 2000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Series 3000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Series 4000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "Series 6000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Torpedo", strength: "medium-full" },
    { name: "Series 6000 Maduro", origin: "Nicaragua", wrapper: "Maduro", vitola: "Torpedo", strength: "medium-full" },
    { name: "Series 7000 Natural", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill", strength: "medium-full" },
    { name: "Padrón 60th Anniversary", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Gordo", strength: "full" },
  ],
  "Oliva": [
    { name: "Serie V Melanio Figurado", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Figurado", strength: "medium-full" },
    { name: "Serie V Melanio Toro", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Toro", strength: "medium-full" },
    { name: "Serie V Melanio Robusto", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Robusto", strength: "medium-full" },
    { name: "Serie V Melanio Churchill", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Churchill", strength: "medium-full" },
    { name: "Serie V Melanio Lancero", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Lancero", strength: "medium-full" },
    { name: "Serie V Melanio Petite Corona", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Petit Corona", strength: "medium-full" },
    { name: "Serie V Melanio Maduro Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
    { name: "Serie V Melanio Maduro Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro", strength: "full" },
    { name: "Serie V Figurado", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Figurado", strength: "full" },
    { name: "Serie V Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Serie V Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Serie V Lancero", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Lancero", strength: "full" },
    { name: "Serie O Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Serie O Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "Serie O Churchill", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill", strength: "medium-full" },
    { name: "Master Blends 3", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Connecticut Reserve Robusto", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Connecticut Reserve Toro", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Toro", strength: "mild-medium" },
    { name: "Cain F Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Cain Maduro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro", strength: "full" },
  ],
  "My Father Cigars": [
    { name: "Le Bijou 1922 Torpedo", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Torpedo", strength: "full" },
    { name: "Le Bijou 1922 Robusto", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Robusto", strength: "full" },
    { name: "Le Bijou 1922 Toro", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Toro", strength: "full" },
    { name: "Le Bijou 1922 Gordo", origin: "Nicaragua", wrapper: "Habano Oscuro", vitola: "Gordo", strength: "full" },
    { name: "The Judge Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "full" },
    { name: "The Judge Gordo", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Gordo", strength: "full" },
    { name: "My Father No. 1", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "full" },
    { name: "My Father No. 2", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "full" },
    { name: "My Father No. 4", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Flor de Las Antillas Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Flor de Las Antillas Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "La Opulencia Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "El Centurion Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
  ],
  "Drew Estate": [
    { name: "Liga Privada No. 9 Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "Liga Privada No. 9 Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "full" },
    { name: "Liga Privada No. 9 Churchill", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Churchill", strength: "full" },
    { name: "Liga Privada No. 9 Lancero", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Lancero", strength: "full" },
    { name: "Liga Privada T52 Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "Liga Privada T52 Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "full" },
    { name: "Undercrown Shade Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "medium" },
    { name: "Undercrown Shade Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "medium" },
    { name: "Undercrown Maduro Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "Undercrown Maduro Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium-full" },
    { name: "Undercrown Sun Grown Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "MUWAT Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "MUWAT Flying Pig", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Perfecto", strength: "full" },
    { name: "Herrera Estelí Robusto Especial", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Herrera Estelí Toro Especial", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "ACID Kuba Kuba", origin: "Nicaragua", wrapper: "Sumatran", vitola: "Robusto", strength: "medium" },
    { name: "ACID Blondie", origin: "Nicaragua", wrapper: "Connecticut Shade", vitola: "Petit Corona", strength: "mild" },
    { name: "ACID 1400cc", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium" },
  ],
  "Davidoff": [
    { name: "Aniversario No. 1", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero", strength: "mild-medium" },
    { name: "Aniversario No. 2", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Churchill", strength: "mild-medium" },
    { name: "Aniversario No. 3", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "mild-medium" },
    { name: "Aniversario Special R", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "702 Series Aniversario No. 3", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "702 Series Special R", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "702 Series Special T", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Torpedo", strength: "medium-full" },
    { name: "Winston Churchill Original", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "medium" },
    { name: "Winston Churchill Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium" },
    { name: "Winston Churchill Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium" },
    { name: "Winston Churchill The Late Hour", origin: "Dominican Republic", wrapper: "Oscuro Maduro", vitola: "Toro", strength: "medium-full" },
    { name: "Signature No. 1", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero", strength: "mild" },
    { name: "Signature 2000", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Petit Corona", strength: "mild" },
    { name: "Nicaragua Robusto", origin: "Dominican Republic", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Nicaragua Toro", origin: "Dominican Republic", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "Escurio Robusto", origin: "Dominican Republic", wrapper: "Brazilian Mata Fina", vitola: "Robusto", strength: "medium-full" },
    { name: "Yamasá Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Millennium Blend Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
  ],
  "Ashton": [
    { name: "VSG Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "VSG Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "VSG Churchill", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "medium-full" },
    { name: "VSG Torpedo", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Torpedo", strength: "medium-full" },
    { name: "VSG Wizard", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Figurado", strength: "full" },
    { name: "ESG Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Cabinet Selection No. 1", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Churchill", strength: "mild" },
    { name: "Cabinet Selection No. 2", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Toro", strength: "mild" },
    { name: "Heritage Robusto", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Aged Maduro No. 10", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Churchill", strength: "medium" },
    { name: "Aged Maduro No. 20", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium" },
    { name: "Aged Maduro No. 40", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "medium" },
    { name: "Classic Robusto", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Robusto", strength: "mild" },
    { name: "Classic Churchill", origin: "Dominican Republic", wrapper: "Connecticut Shade", vitola: "Churchill", strength: "mild" },
  ],
  "Rocky Patel": [
    { name: "Vintage 1990 Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "Vintage 1990 Toro", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium-full" },
    { name: "Vintage 1992 Robusto", origin: "Honduras", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Vintage 1992 Toro", origin: "Honduras", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "The Edge Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "The Edge Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "The Edge Maduro Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "Fifteenth Anniversary Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "A.L.R. Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Sun Grown Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "1961 Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Hamlet 2000 Toro", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium-full" },
  ],
  "AJ Fernandez": [
    { name: "New World Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "New World Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro", strength: "medium-full" },
    { name: "New World Connecticut Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Enclave Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Enclave Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Bellas Artes Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "San Lotano Oval Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Last Call Robusto", origin: "Nicaragua", wrapper: "Pennsylvania Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "Aging Room Quattro Nicaragua Sonata", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Concerto", strength: "medium-full" },
  ],
  "Perdomo": [
    { name: "10th Anniversary Champagne Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "10th Anniversary Maduro Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "Lot 23 Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Lot 23 Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "Reserve Sun Grown Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Reserve Maduro Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "20th Anniversary Connecticut", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "mild-medium" },
    { name: "20th Anniversary Sun Grown", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "20th Anniversary Maduro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro", strength: "full" },
  ],
  "Crowned Heads": [
    { name: "Four Kicks Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Four Kicks Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Four Kicks Churchill", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "medium-full" },
    { name: "Four Kicks Maduro Robusto", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "Headley Grange Robusto", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Robusto", strength: "medium-full" },
    { name: "Headley Grange Toro", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Toro", strength: "medium-full" },
    { name: "Jericho Hill OBS", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
    { name: "Jericho Hill Willy Lee", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Gordo", strength: "full" },
    { name: "Las Calaveras Robusto", origin: "Honduras", wrapper: "Cameroon", vitola: "Robusto", strength: "medium-full" },
    { name: "The Angel's Anvil Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "J.D. Howard Reserve Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Le Careme Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Juarez Robusto", origin: "Dominican Republic", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
  ],
  "Tatuaje": [
    { name: "Reserva SW Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Reserva SW Toro", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Black Label Miami Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "La Verite Toro", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "full" },
    { name: "Miami Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "10th Anniversary Capa Especial", origin: "Nicaragua", wrapper: "Ecuador Sumatra", vitola: "Lonsdale", strength: "medium-full" },
  ],
  "Illusione": [
    { name: "~88~", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "~888~", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Singulares", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Petit Corona", strength: "medium-full" },
    { name: "Fume d'Amour", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Lancero", strength: "full" },
    { name: "MDHK", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Original Documents MX2", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
    { name: "Group of Five Robusto", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Robusto", strength: "full" },
  ],
  "RoMa Craft Tobac": [
    { name: "CroMagnon Anthropus", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
    { name: "CroMagnon Cranium", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Churchill", strength: "full" },
    { name: "Intemperance EC18 Injustice", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Maestranza Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
  ],
  "E.P. Carrillo": [
    { name: "Encore Celestial Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Encore Majestic", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Toro", strength: "medium-full" },
    { name: "La Historia EH Robusto", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Robusto", strength: "medium-full" },
    { name: "Pledge Apogee Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "medium" },
    { name: "New Wave Connecticut Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Inch No. 64 Gordo", origin: "Dominican Republic", wrapper: "Ecuador Sumatra", vitola: "Gordo", strength: "medium-full" },
    { name: "Allegiance Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
  ],
  "Warped Cigars": [
    { name: "El Oso Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Chinchalle", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "La Colmena No. 44", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Petit Corona", strength: "mild-medium" },
    { name: "Sky Flower", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero", strength: "mild-medium" },
    { name: "Maestro del Tiempo 6102", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
  ],
  "Caldwell Cigar Co.": [
    { name: "Long Live the King Robusto", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto", strength: "medium-full" },
    { name: "Long Live the Queen Toro", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Toro", strength: "medium-full" },
    { name: "Eastern Standard Toro", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Eastern Standard Midnight Express", origin: "Dominican Republic", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "full" },
    { name: "All Out Kings Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
  ],
  "Plasencia": [
    { name: "Alma Fuerte Robustus Magnus", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Alma Fuerte Toro Quinto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Alma Fuerte Churchill El Gran Conde", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Churchill", strength: "full" },
    { name: "Cosecha 149 Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "Reserva Original Robusto", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto", strength: "medium-full" },
  ],
  "Joya de Nicaragua": [
    { name: "Antaño 1970 Robusto", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Antaño 1970 Churchill", origin: "Nicaragua", wrapper: "Criollo Nicaragua", vitola: "Churchill", strength: "full" },
    { name: "Clasico Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Joya Red Robusto", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Robusto", strength: "medium-full" },
    { name: "Joya Black Toro", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Toro", strength: "full" },
    { name: "Joya Silver Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
  ],
  "Alec Bradley": [
    { name: "Prensado Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Prensado Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro", strength: "full" },
    { name: "American Classic Robusto", origin: "Honduras", wrapper: "Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Black Market Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Black Market Filthy Hooligan", origin: "Honduras", wrapper: "Barber Pole (Candela / Maduro)", vitola: "Toro", strength: "medium" },
    { name: "Tempus Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
  ],
  "Camacho": [
    { name: "American Barrel-Aged Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
    { name: "Corojo Robusto", origin: "Honduras", wrapper: "Corojo Honduras", vitola: "Robusto", strength: "full" },
    { name: "Ecuador Robusto", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Triple Maduro Robusto", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "full" },
  ],
  "La Flor Dominicana": [
    { name: "Andalusian Bull", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Perfecto", strength: "full" },
    { name: "Double Ligero DL 700 Torpedo", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Torpedo", strength: "full" },
    { name: "Aire Fresco Lancero", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Lancero", strength: "mild-medium" },
    { name: "Ligero Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Cameroon Cabinet Robusto", origin: "Dominican Republic", wrapper: "Cameroon", vitola: "Robusto", strength: "medium" },
  ],
  "CAO": [
    { name: "Flathead V660 Big Block", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Gordo", strength: "medium-full" },
    { name: "Flathead V554 Carb", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Brazilia Gol!", origin: "Brazil", wrapper: "Brazilian Mata Fina", vitola: "Toro", strength: "medium" },
    { name: "America Toro", origin: "Nicaragua", wrapper: "Barber Pole (Candela / Maduro)", vitola: "Toro", strength: "medium" },
    { name: "MX2 Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "Cameroon Robusto", origin: "Honduras", wrapper: "Cameroon", vitola: "Robusto", strength: "medium" },
  ],
  "Dunbarton Tobacco & Trust": [
    { name: "Sin Compromiso Seleccion No. 11", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Sobremesa Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Sobremesa Brûlée", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "full" },
    { name: "Red Meat Lovers Club Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "medium" },
    { name: "Muestra de Saka Nacatamale", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
  ],
  "Cohiba (Cuban)": [
    { name: "Siglo VI", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Gordo", strength: "medium-full" },
    { name: "Siglo I", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Petit Corona", strength: "medium" },
    { name: "Siglo II", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Corona", strength: "medium" },
    { name: "Siglo III", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Lonsdale", strength: "medium" },
    { name: "Siglo IV", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "Siglo V", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "medium-full" },
    { name: "Behike 52", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "full" },
    { name: "Behike 54", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro", strength: "full" },
    { name: "Behike 56", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Gordo", strength: "full" },
    { name: "Robustos", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Esplendidos", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Churchill", strength: "medium-full" },
    { name: "Lanceros", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Lancero", strength: "medium-full" },
  ],
  "Montecristo (Cuban)": [
    { name: "No. 2", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Torpedo", strength: "medium-full" },
    { name: "No. 4", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Petit Corona", strength: "medium" },
    { name: "Edmundo", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium" },
    { name: "Open Eagle", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Gordo", strength: "medium-full" },
    { name: "Linea 1935 Dumas", origin: "Cuba", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium" },
  ],
  "Aganorsa Leaf": [
    { name: "Supreme Leaf Robusto", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Robusto", strength: "full" },
    { name: "Supreme Leaf Toro", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Aniversario Connecticut Toro", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "mild-medium" },
    { name: "Aniversario Habano Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "medium-full" },
    { name: "JFR Lunatic Toro", origin: "Nicaragua", wrapper: "Habano Nicaragua", vitola: "Toro", strength: "full" },
    { name: "Swamp Thang Lancero", origin: "Nicaragua", wrapper: "Corojo Nicaragua", vitola: "Lancero", strength: "full" },
  ],
  "Macanudo": [
    { name: "Café Hyde Park", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Churchill", strength: "mild" },
    { name: "Café Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild" },
    { name: "Café Gigante", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Gordo", strength: "mild" },
    { name: "Inspirado White Connecticut Robusto", origin: "Dominican Republic", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Inspirado Orange Habano Robusto", origin: "Dominican Republic", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "Inspirado Black Oscuro Robusto", origin: "Dominican Republic", wrapper: "Habano Oscuro", vitola: "Robusto", strength: "full" },
    { name: "Inspirado Green Candela Robusto", origin: "Dominican Republic", wrapper: "Candela", vitola: "Robusto", strength: "mild" },
  ],
  "Leaf by Oscar": [
    { name: "2012 Habano Toro", origin: "Honduras", wrapper: "Habano Ecuador", vitola: "Toro", strength: "medium-full" },
    { name: "2012 Connecticut Toro", origin: "Honduras", wrapper: "Ecuador Connecticut Shade", vitola: "Toro", strength: "mild-medium" },
    { name: "2012 Maduro Toro", origin: "Honduras", wrapper: "Connecticut Broadleaf Maduro", vitola: "Toro", strength: "medium-full" },
    { name: "Sumatra Toro", origin: "Honduras", wrapper: "Ecuador Sumatra", vitola: "Toro", strength: "medium" },
  ],
  "Espinosa Cigars": [
    { name: "Las 6 Provincias Robusto", origin: "Nicaragua", wrapper: "San Andrés Maduro", vitola: "Robusto", strength: "full" },
    { name: "601 Blue Label Robusto", origin: "Nicaragua", wrapper: "Habano Ecuador", vitola: "Robusto", strength: "medium-full" },
    { name: "601 Red Label Robusto", origin: "Nicaragua", wrapper: "Connecticut Broadleaf Maduro", vitola: "Robusto", strength: "medium-full" },
    { name: "Crema No. 7 Robusto", origin: "Nicaragua", wrapper: "Ecuador Connecticut Shade", vitola: "Robusto", strength: "mild-medium" },
    { name: "Laranja Reserva Robusto", origin: "Nicaragua", wrapper: "Brazilian Mata Fina", vitola: "Robusto", strength: "medium-full" },
  ],
};

// ── Constants ──────────────────────────────────────────────────────────────────
const WRAPPER_TYPES = [
  "Connecticut Shade","Connecticut Broadleaf","Connecticut Broadleaf Maduro","Ecuador Connecticut Shade","Connecticut Habano",
  "Habano","Habano Ecuador","Habano Nicaragua","Habano Oscuro","Habano Rosado","Habano San Andrés",
  "Corojo","Corojo Honduras","Corojo Nicaragua","Corojo Oscuro","Criollo","Criollo Nicaragua","Criollo '98","Corojo '99",
  "Maduro","San Andrés Maduro","Brazilian Mata Fina Maduro","Pennsylvania Broadleaf Maduro","Oscuro Maduro",
  "Sumatra","Ecuador Sumatra","Indonesian Sumatra","San Andrés (Mexican)","Brazilian Mata Fina",
  "Cameroon","Cameroon Shade","Dominican","Nicaraguan Puro","Ecuadorian",
  "Candela","Natural","Claro","Colorado Claro","Colorado","Colorado Maduro","Oscuro","Double Maduro","Rosado",
  "Barber Pole (Candela / Maduro)","Barber Pole (Habano / Connecticut)","Barber Pole (Habano / Candela)","Triple Wrap",
];

const STRENGTHS = ["mild","mild-medium","medium","medium-full","full"];

const BRANDS = Object.keys(CIGAR_DB).sort().concat([
  "Romeo y Julieta (Cuban)","Romeo y Julieta (Dominican)","Partagás (Cuban)",
  "H. Upmann (Cuban)","H. Upmann (Dominican)","Bolivar (Cuban)","Hoyo de Monterrey (Cuban)","Punch (Cuban)",
  "Montecristo (Dominican)","General Cigar Co.","La Aurora","West Tampa Tobacco",
  "Punch (Honduras)","Hoyo de Monterrey (Honduras)","Camacho (Honduras)","Balmoral",
  "Protocol","La Gloria Cubana","Nomad Cigar Co.","Nub","Emilio Cigars","Quesada Cigars",
  "Kristoff","Gurkha","ACID (Drew Estate)","Baccarat","Tatiana","Privada Cigar Club",
  "Domain Cigars","El Mago Cigars","Avowed Cigars","Apostate Cigars","Wildfire Cigar Co.",
  "Tradecraft Cigars","Deadwood Cigars","CroMagnon","Craft Maquette","Fumero","Villiger",
  "Mombacho","Matilde","CAIN","601","Gran Habano","Partagas (Dominican)","Oscar Valladares",
  "San Cristobal","Man O' War","Powstanie","ADVentura","Viaje","Asylum",
].filter(b => !CIGAR_DB[b]));

const ORIGINS = ["Nicaragua","Dominican Republic","Honduras","Cuba","Ecuador","Brazil","Mexico","Panama","USA","Cameroon","Indonesia","Peru","Colombia","Costa Rica","Bolivia","Multi-Country"];
const VITOLAS = [
  "Robusto","Toro","Churchill","Lancero","Belicoso","Torpedo","Gordo","Petit Corona","Corona","Panatela",
  "Presidente","Diadema","Perfecto","Figurado","Culebra","Double Corona","Gran Corona","Short Robusto",
  "Rothschild","Corona Extra","Lonsdale","Gran Toro","Magnum","Apollo","Concerto","Epicure",
  "Short Perfecto","Box-Pressed Toro","Box-Pressed Robusto","Salomon","Gran Pirámide",
];
const FLAVOR_TAGS = ["Cedar","Earth","Pepper","Leather","Coffee","Cream","Nuts","Cocoa","Fruit","Floral","Spice","Toast","Honey","Herbal","Molasses","Dark Chocolate","Licorice","Raisin","Vanilla","Caramel","Cinnamon","Oak","Hay","Bread","Grass","Mineral"];
const PAIRINGS = ["Bourbon","Single Malt Scotch","Rye Whiskey","Cognac","Rum","Mezcal","IPA","Stout","Espresso","Cold Brew","Dark Chocolate","Aged Cheese","Port","Armagnac","Blended Scotch"];
const STATUSES = ["In Humidor","Smoked","Wishlist"];

const BLOCKLIST = ["fuck","shit","bitch","cunt","dick","cock","pussy","nigger","nigga","faggot","fag","retard","spic","kike","chink","whore","slut","rape","nazi","hitler"];

function filterName(raw) {
  const t = raw.trim();
  if (!t) return { ok:false, reason:"Name cannot be empty." };
  if (t.length < 2) return { ok:false, reason:"Name is too short." };
  if (t.length > 120) return { ok:false, reason:"Name is too long (max 120 chars)." };
  if (!/[a-zA-Z]/.test(t)) return { ok:false, reason:"Name must contain at least one letter." };
  if (/https?:\/\/|<[^>]+>|javascript:/i.test(t)) return { ok:false, reason:"Name contains invalid content." };
  const lower = t.toLowerCase();
  for (const w of BLOCKLIST) if (lower.includes(w)) return { ok:false, reason:"Name contains prohibited content." };
  return { ok:true, value:t };
}

function iqrAvg(vals) {
  if (!vals.length) return 0;
  if (vals.length < 4) return vals.reduce((a,b)=>a+b,0)/vals.length;
  const s=[...vals].sort((a,b)=>a-b);
  const q1=s[Math.floor(s.length*0.25)],q3=s[Math.floor(s.length*0.75)],iqr=q3-q1;
  const f=s.filter(v=>v>=q1-1.5*iqr&&v<=q3+1.5*iqr);
  return f.reduce((a,b)=>a+b,0)/f.length;
}

function buildSeedRepo() {
  const r={};
  for(const [brand,cigars] of Object.entries(CIGAR_DB)) r[brand]=cigars.map(c=>c.name);
  return r;
}

// ── Color System ───────────────────────────────────────────────────────────────
const C = {
  bg:"#111111", surface:"#1c1c1c", card:"#242424", cardHover:"#2a2a2a",
  border:"#333333", borderHover:"#444444",
  accent:"#f0620a", accentDim:"#b84800", accentGlow:"rgba(240,98,10,0.15)",
  gold:"#c9922a", goldDim:"#8a6010",
  text:"#f2f2f2", textMuted:"#999999", textDim:"#555555",
  success:"#3d9e50", successDim:"rgba(61,158,80,0.15)",
  danger:"#c04040", dangerDim:"rgba(192,64,64,0.15)",
  warn:"#b08030",
  // Strength colors
  mild:"#52b060", mildMedium:"#a0b840", medium:"#e0a820", mediumFull:"#e06020", full:"#d03030",
};

const STRENGTH_COLORS = {
  mild: C.mild, "mild-medium": C.mildMedium, medium: C.medium, "medium-full": C.mediumFull, full: C.full
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;background:${C.bg};}
  body{overscroll-behavior:none;}
  .app{font-family:'Inter',sans-serif;font-weight:400;color:${C.text};background:${C.bg};min-height:100vh;display:flex;flex-direction:column;max-width:480px;margin:0 auto;position:relative;}
  @media(min-width:700px){.app{max-width:900px;}}

  /* ── Header ── */
  .hdr{background:${C.surface};border-bottom:1px solid ${C.border};padding:14px 18px 12px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:60;}
  .hdr-brand{display:flex;align-items:center;gap:10px;}
  .hdr-logo{width:34px;height:34px;border-radius:8px;background:${C.accent};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .hdr-logo svg{width:20px;height:20px;}
  .hdr-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:${C.text};letter-spacing:-0.3px;}
  .hdr-sub{font-size:10px;color:${C.textDim};font-weight:500;letter-spacing:1px;text-transform:uppercase;margin-top:1px;}
  .hdr-right{display:flex;align-items:center;gap:10px;}
  .search-btn{background:none;border:1px solid ${C.border};color:${C.textMuted};width:34px;height:34px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
  .search-btn:hover{border-color:${C.accent};color:${C.accent};}
  .sort-btn{background:none;border:1px solid ${C.border};color:${C.textMuted};padding:0 10px;height:34px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;transition:all 0.15s;}
  .sort-btn:hover{border-color:${C.accent};color:${C.accent};}
  .sort-btn.active{background:${C.accentGlow};border-color:${C.accent};color:${C.accent};}

  /* ── Search bar ── */
  .search-bar{background:${C.surface};border-bottom:1px solid ${C.border};padding:10px 18px;display:flex;align-items:center;gap:10px;}
  .search-input{background:${C.card};border:1px solid ${C.border};color:${C.text};padding:9px 12px;border-radius:8px;font-family:'Inter',sans-serif;font-size:14px;font-weight:400;outline:none;flex:1;transition:border-color 0.15s;}
  .search-input:focus{border-color:${C.accent};}
  .search-input::placeholder{color:${C.textDim};}
  .search-clear{background:none;border:none;color:${C.textDim};cursor:pointer;font-size:18px;padding:0 4px;line-height:1;}

  /* ── Scrollable content ── */
  .content{flex:1;overflow-y:auto;padding:14px 18px 90px;overscroll-behavior:contain;}
  @media(min-width:700px){.content{padding-bottom:24px;}}

  /* ── Stats strip ── */
  .stats-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;}
  @media(min-width:700px){.stats-strip{grid-template-columns:repeat(6,1fr);}}
  .stat-card{background:${C.surface};border:1px solid ${C.border};border-radius:10px;padding:11px 13px;cursor:default;transition:border-color 0.15s;}
  .stat-card:hover{border-color:${C.borderHover};}
  .stat-label{font-size:9px;color:${C.textDim};text-transform:uppercase;letter-spacing:1px;font-weight:600;}
  .stat-value{font-family:'Playfair Display',serif;font-size:22px;color:${C.accent};margin-top:3px;line-height:1;font-weight:700;}
  .stat-sub{font-size:10px;color:${C.textDim};font-weight:500;margin-top:3px;}
  .stat-card.green .stat-value{color:${C.success};}
  .stat-card.gold .stat-value{color:${C.gold};}

  /* ── Section header ── */
  .sec-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
  .sec-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:${C.text};}
  .sec-count{font-size:12px;color:${C.textDim};font-weight:500;margin-left:8px;}

  /* ── Filter chips ── */
  .filter-row{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;}
  .filter-row::-webkit-scrollbar{display:none;}
  .fchip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid ${C.border};color:${C.textMuted};background:none;font-family:'Inter',sans-serif;transition:all 0.15s;white-space:nowrap;flex-shrink:0;}
  .fchip:hover{border-color:${C.borderHover};color:${C.text};}
  .fchip.active{background:${C.accentGlow};border-color:${C.accent};color:${C.accent};}

  /* ── Cigar Grid ── */
  .cigar-grid{display:grid;grid-template-columns:1fr;gap:10px;}
  @media(min-width:480px){.cigar-grid{grid-template-columns:repeat(2,1fr);}}
  @media(min-width:800px){.cigar-grid{grid-template-columns:repeat(3,1fr);}}

  /* ── Cigar Card ── */
  .ccard{background:${C.card};border:1px solid ${C.border};border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:border-color 0.18s,background 0.18s;cursor:default;}
  .ccard:hover{border-color:${C.borderHover};background:${C.cardHover};}
  .ccard-photo{width:100%;height:110px;object-fit:cover;display:block;cursor:pointer;}
  .ccard-photo-wrap{position:relative;overflow:hidden;}
  .ccard-photo-gradient{position:absolute;bottom:0;left:0;right:0;height:50px;background:linear-gradient(to top,${C.card},transparent);pointer-events:none;}
  .ccard-photo-placeholder{width:100%;height:110px;background:${C.surface};display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;gap:5px;transition:background 0.15s;border-bottom:1px solid ${C.border};}
  .ccard-photo-placeholder:hover{background:#1f1f1f;}
  .photo-hint{font-size:10px;color:${C.textDim};font-weight:500;}
  .ccard-body{padding:12px 13px;flex:1;display:flex;flex-direction:column;gap:6px;}
  .ccard-name{font-family:'Playfair Display',serif;font-size:14px;color:${C.accent};line-height:1.25;font-weight:700;}
  .ccard-brand{font-size:11px;color:${C.textMuted};font-weight:500;}
  .ccard-vitola{font-size:11px;color:${C.textDim};font-weight:500;}
  .ccard-meta{display:flex;flex-direction:column;gap:3px;margin-top:2px;}
  .ccard-row{display:flex;justify-content:space-between;align-items:center;font-size:11px;}
  .ccard-lbl{color:${C.textDim};font-weight:500;}
  .ccard-val{color:${C.text};font-weight:600;}
  .ccard-val.green{color:${C.success};}
  .ccard-val.gold{color:${C.gold};}
  .strength-bar{display:flex;align-items:center;gap:6px;margin-top:4px;}
  .strength-label{font-size:10px;color:${C.textDim};font-weight:500;width:70px;}
  .strength-pips{display:flex;gap:2px;}
  .pip{width:14px;height:4px;border-radius:2px;background:${C.border};}
  .pip.on{background:var(--pip-color,${C.accent});}
  .ccard-footer{display:flex;align-items:center;justify-content:space-between;margin-top:6px;padding-top:8px;border-top:1px solid ${C.border};}
  .status-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;cursor:pointer;transition:opacity 0.15s;border:none;font-family:'Inter',sans-serif;}
  .status-pill:hover{opacity:0.8;}
  .sp-in{background:rgba(61,158,80,0.15);color:#3d9e50;}
  .sp-smoked{background:rgba(176,72,0,0.15);color:#b84800;}
  .sp-wish{background:rgba(100,100,220,0.12);color:#7878d8;}
  .qty-badge{font-size:11px;font-weight:700;color:${C.textDim};background:${C.surface};border:1px solid ${C.border};border-radius:6px;padding:2px 7px;}
  .ccard-actions{display:flex;gap:8px;align-items:center;}
  .ccard-btn{background:none;border:none;color:${C.textDim};font-size:11px;font-weight:600;cursor:pointer;padding:0;font-family:'Inter',sans-serif;transition:color 0.12s;}
  .ccard-btn:hover{color:${C.text};}
  .ccard-btn.danger:hover{color:${C.danger};}
  .ccard-btn.flag:hover{color:${C.warn};}

  /* ── Log cards ── */
  .log-list{display:flex;flex-direction:column;gap:10px;}
  .log-card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:14px 15px;transition:border-color 0.15s;}
  .log-card:hover{border-color:${C.borderHover};}
  .log-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;}
  .log-left{flex:1;min-width:0;}
  .log-cigar{font-family:'Playfair Display',serif;font-size:14px;color:${C.accent};font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .log-vitola{font-size:11px;color:${C.textMuted};font-weight:500;margin-top:1px;}
  .log-date{font-size:10px;color:${C.textDim};font-weight:500;margin-top:2px;}
  .score-circle{width:44px;height:44px;border-radius:50%;border:2px solid ${C.accent};display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;background:${C.accentGlow};}
  .score-num{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:${C.accent};line-height:1;}
  .score-denom{font-size:8px;color:${C.textDim};font-weight:500;line-height:1;}
  .log-scores{display:flex;gap:12px;margin-top:8px;}
  .score-mini{font-size:11px;color:${C.textDim};font-weight:500;}
  .score-mini span{color:${C.text};font-weight:600;}
  .log-notes{font-size:12px;color:${C.textMuted};margin-top:8px;font-style:italic;line-height:1.55;font-weight:400;border-left:2px solid ${C.border};padding-left:10px;}
  .log-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;}
  .log-tag{padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600;background:${C.surface};color:${C.textMuted};border:1px solid ${C.border};}
  .log-pairings{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
  .pairing-tag{padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600;background:rgba(201,146,42,0.1);color:${C.gold};border:1px solid rgba(201,146,42,0.25);}

  /* ── Empty state ── */
  .empty{text-align:center;padding:48px 20px;color:${C.textDim};}
  .empty-icon{font-size:48px;margin-bottom:16px;opacity:0.4;}
  .empty-title{font-family:'Playfair Display',serif;font-size:17px;color:${C.textMuted};font-weight:700;}
  .empty-sub{font-size:13px;font-weight:400;margin-top:6px;line-height:1.5;color:${C.textDim};}

  /* ── FAB ── */
  .fab{position:fixed;right:20px;bottom:80px;z-index:55;width:54px;height:54px;border-radius:16px;background:${C.accent};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.15s,opacity 0.15s;}
  .fab:hover{transform:scale(1.06);}
  .fab:active{transform:scale(0.97);}
  .fab svg{width:22px;height:22px;color:#fff;}
  @media(min-width:700px){.fab{bottom:20px;right:24px;}}

  /* ── Bottom nav ── */
  .bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:${C.surface};border-top:1px solid ${C.border};display:flex;z-index:60;padding-bottom:env(safe-area-inset-bottom);}
  @media(min-width:700px){.bottom-nav{max-width:900px;}}
  .bnav-btn{flex:1;background:none;border:none;padding:10px 4px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;color:${C.textDim};font-family:'Inter',sans-serif;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;transition:color 0.15s;}
  .bnav-btn:hover{color:${C.textMuted};}
  .bnav-btn.active{color:${C.accent};}
  .bnav-icon{width:22px;height:22px;}
  .bnav-indicator{width:4px;height:4px;border-radius:50%;background:${C.accent};margin-top:1px;opacity:0;transition:opacity 0.15s;}
  .bnav-btn.active .bnav-indicator{opacity:1;}

  /* ── Modals ── */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.72);display:flex;align-items:flex-end;justify-content:center;z-index:100;backdrop-filter:blur(4px);}
  @media(min-width:600px){.modal-overlay{align-items:center;}}
  .modal{background:${C.surface};border:1px solid ${C.border};border-radius:18px 18px 0 0;padding:0;width:100%;max-width:520px;max-height:94vh;overflow:hidden;display:flex;flex-direction:column;}
  @media(min-width:600px){.modal{border-radius:16px;max-height:88vh;}}
  .modal-handle{width:36px;height:4px;border-radius:2px;background:${C.border};margin:12px auto 0;}
  .modal-header{padding:16px 20px 14px;border-bottom:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .modal-title{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:${C.text};}
  .modal-close{background:none;border:1px solid ${C.border};color:${C.textMuted};width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
  .modal-close:hover{border-color:${C.accent};color:${C.accent};}
  .modal-body{overflow-y:auto;padding:18px 20px;flex:1;}
  .modal-footer{padding:14px 20px;border-top:1px solid ${C.border};display:flex;gap:10px;justify-content:flex-end;flex-shrink:0;}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .fg{display:flex;flex-direction:column;gap:5px;}
  .fg.full{grid-column:1/-1;}
  .form-label{font-size:11px;color:${C.textMuted};text-transform:uppercase;letter-spacing:0.7px;font-weight:600;}
  .form-input{background:#1a1a1a;border:1px solid ${C.border};color:${C.text};padding:10px 12px;border-radius:8px;font-family:'Inter',sans-serif;font-size:14px;font-weight:400;outline:none;transition:border-color 0.15s;width:100%;-webkit-appearance:none;}
  .form-input:focus{border-color:${C.accent};}
  .form-input option{background:#1a1a1a;}
  .form-input::placeholder{color:${C.textDim};}
  .btn-primary{background:${C.accent};color:#fff;border:none;padding:11px 22px;border-radius:10px;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;transition:opacity 0.15s,transform 0.1s;}
  .btn-primary:hover{opacity:0.88;}
  .btn-primary:active{transform:scale(0.98);}
  .btn-primary:disabled{opacity:0.35;cursor:not-allowed;}
  .btn-ghost{background:none;border:1px solid ${C.border};color:${C.textMuted};padding:11px 18px;border-radius:10px;cursor:pointer;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;transition:all 0.15s;}
  .btn-ghost:hover{border-color:${C.accent};color:${C.accent};}

  /* ── Name autocomplete ── */
  .name-wrap{position:relative;}
  .suggestions{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#1e1e1e;border:1px solid ${C.border};border-radius:10px;z-index:20;max-height:200px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.5);}
  .suggestion-item{padding:10px 13px;font-size:13px;font-weight:500;cursor:pointer;display:flex;justify-content:space-between;align-items:center;color:${C.text};transition:background 0.1s;}
  .suggestion-item:hover{background:#2a2a2a;}
  .suggestion-item:first-child{border-radius:10px 10px 0 0;}
  .suggestion-item:last-child{border-radius:0 0 10px 10px;}
  .sbadge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:0.3px;}
  .sbadge.verified{background:rgba(61,158,80,0.15);color:${C.success};border:1px solid rgba(61,158,80,0.3);}
  .sbadge.community{background:${C.surface};color:${C.textDim};border:1px solid ${C.border};}
  .sbadge.new{background:${C.accentGlow};color:${C.accent};border:1px solid rgba(240,98,10,0.3);}
  .autofill-tag{font-size:10px;color:${C.success};font-weight:600;margin-left:6px;}
  .name-err{font-size:11px;color:${C.danger};font-weight:500;margin-top:3px;}

  /* ── Stars & sliders ── */
  .stars{display:flex;gap:3px;}
  .star{font-size:20px;cursor:pointer;color:${C.border};transition:color 0.1s,transform 0.08s;}
  .star:hover{transform:scale(1.15);}
  .star.lit{color:${C.accent};}
  input[type=range]{accent-color:${C.accent};width:100%;}

  /* ── Flavor/pairing tag pickers ── */
  .tag-picker{display:flex;flex-wrap:wrap;gap:6px;}
  .tpick{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid ${C.border};color:${C.textMuted};background:none;font-family:'Inter',sans-serif;transition:all 0.12s;}
  .tpick:hover{border-color:${C.borderHover};color:${C.text};}
  .tpick.sel{background:${C.accentGlow};border-color:${C.accent};color:${C.accent};}
  .tpick.pair.sel{background:rgba(201,146,42,0.12);border-color:${C.gold};color:${C.gold};}

  /* ── Insights ── */
  .insight-card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:14px 16px;margin-bottom:10px;}
  .insight-card.accent-l{border-left:3px solid ${C.accent};}
  .insight-card.success-l{border-left:3px solid ${C.success};}
  .insight-card.gold-l{border-left:3px solid ${C.gold};}
  .insight-label{font-size:10px;color:${C.textMuted};text-transform:uppercase;letter-spacing:0.7px;font-weight:600;margin-bottom:4px;}
  .insight-value{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:${C.accent};line-height:1;}
  .insight-value.success{color:${C.success};}
  .insight-value.gold{color:${C.gold};}
  .insight-sub{font-size:11px;color:${C.textDim};font-weight:500;margin-top:4px;}
  .bar-row{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
  .bar-label{font-size:12px;color:${C.textMuted};font-weight:500;width:130px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .bar-track{flex:1;background:${C.surface};border-radius:3px;height:6px;overflow:hidden;}
  .bar-fill{height:6px;border-radius:3px;background:${C.accent};transition:width 0.4s;}
  .bar-count{font-size:11px;color:${C.textDim};font-weight:600;width:20px;text-align:right;flex-shrink:0;}
  .divider{border:none;border-top:1px solid ${C.border};margin:14px 0;}

  /* ── Toast ── */
  .toast{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#2a2a2a;border:1px solid ${C.border};color:${C.text};padding:11px 20px;border-radius:10px;font-size:13px;font-weight:500;z-index:200;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.5);}
  @media(min-width:700px){.toast{bottom:24px;}}

  /* ── Misc ── */
  .device-id{font-size:9px;color:${C.textDim};font-weight:500;font-family:monospace;}
  .section-divider{font-size:11px;color:${C.textDim};font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:14px 0 8px;display:flex;align-items:center;gap:8px;}
  .section-divider::after{content:'';flex:1;height:1px;background:${C.border};}

  /* ── Scrollbar ── */
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px;}
`;

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const Icon = {
  smoke: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 16h14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H3"/><path d="M19 16V8"/><path d="M22 16V9a4 4 0 0 0-4-4 2 2 0 0 1 0-4"/></svg>,
  notebook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 6L10.5 3h3L15 6"/></svg>,
  logo: <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="3" y="25" fontFamily="'Playfair Display', serif" fontSize="22" fontWeight="700" fill="white">C</text><text x="17" y="25" fontFamily="'Playfair Display', serif" fontSize="22" fontWeight="700" fill="black">H</text></svg>,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const STRENGTH_PIPS = { mild:1, "mild-medium":2, medium:3, "medium-full":4, full:5 };

function StrengthBar({ strength }) {
  if (!strength) return null;
  const pips = STRENGTH_PIPS[strength] || 3;
  const col = STRENGTH_COLORS[strength] || C.accent;
  return (
    <div className="strength-bar">
      <span className="strength-label">{strength.replace('-',' ')}</span>
      <div className="strength-pips">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`pip${i<=pips?' on':''}`} style={i<=pips?{background:col}:{}}/>
        ))}
      </div>
    </div>
  );
}

const statusOrder = { "In Humidor":0, Smoked:1, Wishlist:2 };
const nextStatus = { "In Humidor":"Smoked", Smoked:"Wishlist", Wishlist:"In Humidor" };
const statusClass = s => s==="In Humidor"?"sp-in":s==="Smoked"?"sp-smoked":"sp-wish";

// ── App ────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = { brand:"",vitola:"Robusto",origin:"Nicaragua",wrapper:"Connecticut Shade",strength:"medium",qty:1,cost:"",msrp:"",status:"In Humidor",acquired:new Date().toISOString().slice(0,10) };
const EMPTY_LOG  = { cigarId:"",date:new Date().toISOString().slice(0,10),rating:8,draw:8,burn:8,flavors:[],pairings:[],notes:"" };

export default function App() {
  const deviceId = useMemo(()=>getDeviceId(),[]);
  const [tab, setTab] = useState("collection");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date"); // date | brand | rating
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [showAddCigar, setShowAddCigar] = useState(false);
  const [showAddLog, setShowAddLog] = useState(false);
  const [toast, setToast] = useState(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const [cigars, setCigarsRaw] = useState(()=>local.get('cigars')||[]);
  const [logs, setLogsRaw] = useState(()=>local.get('logs')||[]);
  const [cigarRepo, setCigarRepoRaw] = useState(()=>{
    const seed=buildSeedRepo(), saved=shared.get('cigar_repo')||{};
    const m={...seed};
    for(const b in saved) m[b]=Array.from(new Set([...(m[b]||[]),...saved[b]]));
    return m;
  });
  const [sharedMsrp, setSharedMsrpRaw] = useState(()=>shared.get('msrp_pool')||{});

  function setCigars(v){const val=typeof v==='function'?v(cigars):v;setCigarsRaw(val);local.set('cigars',val);}
  function setLogs(v){const val=typeof v==='function'?v(logs):v;setLogsRaw(val);local.set('logs',val);}
  function setCigarRepo(v){const val=typeof v==='function'?v(cigarRepo):v;setCigarRepoRaw(val);shared.set('cigar_repo',val);}
  function setSharedMsrp(v){const val=typeof v==='function'?v(sharedMsrp):v;setSharedMsrpRaw(val);shared.set('msrp_pool',val);}

  const [nameInput, setNameInput] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [cigarForm, setCigarForm] = useState(EMPTY_FORM);
  const [logForm, setLogForm] = useState(EMPTY_LOG);
  const fileRefs = useRef({});

  useEffect(()=>{
    const brand=cigarForm.brand;
    if(!brand||!nameInput.trim()){setNameSuggestions([]);return;}
    const pool=cigarRepo[brand]||[];
    const q=nameInput.toLowerCase();
    setNameSuggestions(pool.filter(n=>n.toLowerCase().includes(q)).slice(0,10));
  },[nameInput,cigarForm.brand,cigarRepo]);

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(null),2600);}

  function applyAutoFill(brand,name){
    const match=(CIGAR_DB[brand]||[]).find(c=>c.name.toLowerCase()===name.toLowerCase());
    if(match){
      setCigarForm(p=>({...p,vitola:match.vitola||p.vitola,origin:match.origin||p.origin,wrapper:match.wrapper||p.wrapper,strength:match.strength||p.strength}));
      setAutoFilled(true);
    } else setAutoFilled(false);
  }

  function selectSuggestion(name){setNameInput(name);setShowSugg(false);applyAutoFill(cigarForm.brand,name);}

  function submitNameToRepo(name,brand){
    const chk=filterName(name);
    if(!chk.ok){setNameErr(chk.reason);return null;}
    setNameErr("");
    const clean=chk.value;
    const ex=(cigarRepo[brand]||[]).map(n=>n.toLowerCase());
    if(!ex.includes(clean.toLowerCase())){
      setCigarRepo(p=>({...p,[brand]:[...(p[brand]||[]),clean]}));
      showToast(`"${clean}" added to community repo`);
    }
    return clean;
  }

  function flagName(brand,name){
    const flags=shared.get('cigar_flags')||[];
    if(!flags.find(f=>f.brand===brand&&f.name===name)){flags.push({brand,name,ts:Date.now()});shared.set('cigar_flags',flags);}
    showToast(`"${name}" flagged for review`);
  }

  function contributeToPool(cigar){
    if(!cigar.msrp||cigar.msrp<=0)return;
    const key=`${cigar.brand}||${cigar.vitola}`;
    setSharedMsrp(p=>{const pool={...p};if(!pool[key])pool[key]=[];if(!pool[key].includes(cigar.msrp))pool[key]=[...pool[key],cigar.msrp];return pool;});
  }

  function cycleStatus(id){
    setCigars(p=>p.map(c=>c.id===id?{...c,status:nextStatus[c.status]}:c));
  }

  const allMsrpVals = useMemo(()=>[...cigars.filter(c=>c.msrp>0).map(c=>c.msrp),...Object.values(sharedMsrp).flat()],[cigars,sharedMsrp]);
  const costVals = useMemo(()=>cigars.filter(c=>c.cost>0).map(c=>c.cost),[cigars]);
  const avgMsrp = iqrAvg(allMsrpVals);
  const avgCost = iqrAvg(costVals);
  const humidorCount = cigars.filter(c=>c.status==="In Humidor").reduce((a,c)=>a+c.qty,0);
  const totalSmoked = cigars.filter(c=>c.status==="Smoked").length;
  const wishlistCount = cigars.filter(c=>c.status==="Wishlist").length;
  const avgRating = logs.length?(logs.reduce((a,l)=>a+l.rating,0)/logs.length).toFixed(1):"—";

  const filteredCigars = useMemo(()=>{
    let list = filter==="All"?cigars:cigars.filter(c=>c.status===filter);
    if(searchQ.trim()){
      const q=searchQ.toLowerCase();
      list=list.filter(c=>(c.name||"").toLowerCase().includes(q)||(c.brand||"").toLowerCase().includes(q)||(c.origin||"").toLowerCase().includes(q)||(c.wrapper||"").toLowerCase().includes(q));
    }
    if(sortBy==="brand") list=[...list].sort((a,b)=>(a.brand||"").localeCompare(b.brand||""));
    else if(sortBy==="rating"){
      const bestRating=c=>{const log=logs.filter(l=>l.cigarId===c.id);return log.length?Math.max(...log.map(l=>l.rating)):0;};
      list=[...list].sort((a,b)=>bestRating(b)-bestRating(a));
    } else list=[...list].sort((a,b)=>b.id-a.id);
    return list;
  },[cigars,filter,searchQ,sortBy,logs]);

  function addCigar(){
    const clean=submitNameToRepo(nameInput,cigarForm.brand);
    if(!clean)return;
    const nc={...cigarForm,id:Date.now(),name:clean,cost:parseFloat(cigarForm.cost)||0,msrp:parseFloat(cigarForm.msrp)||0,qty:parseInt(cigarForm.qty)||1,photo:null};
    setCigars(p=>[...p,nc]);
    contributeToPool(nc);
    setShowAddCigar(false);setNameInput("");setNameErr("");setAutoFilled(false);setCigarForm(EMPTY_FORM);
    showToast("Cigar added to collection");
  }

  function addLog(){
    setLogs(p=>[...p,{...logForm,id:Date.now(),cigarId:parseInt(logForm.cigarId)}]);
    setShowAddLog(false);setLogForm(EMPTY_LOG);
    showToast("Tasting log saved");
  }

  function quickWishlist(c){
    const nc={...c,id:Date.now(),status:"Wishlist",qty:1,cost:0,msrp:0,photo:null};
    setCigars(p=>[...p,nc]);showToast(`${c.name} added to wishlist`);
  }

  const getCigar = id=>cigars.find(c=>c.id===id);

  // Brand stats for insights
  const brandStats = useMemo(()=>{
    const map={};
    cigars.forEach(c=>{map[c.brand]=(map[c.brand]||0)+1;});
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8);
  },[cigars]);

  const originStats = useMemo(()=>{
    const map={};
    cigars.forEach(c=>{map[c.origin]=(map[c.origin]||0)+1;});
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,6);
  },[cigars]);

  const topRated = useMemo(()=>[...logs].sort((a,b)=>b.rating-a.rating).slice(0,5),[logs]);

  const openAdd = (mode) => {
    if(mode==="cigar"){setShowAddCigar(true);setNameInput("");setNameErr("");setAutoFilled(false);}
    else{setShowAddLog(true);}
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* ── Header ── */}
        <div className="hdr">
          <div className="hdr-brand">
            <div className="hdr-logo">{Icon.logo}</div>
            <div>
              <div className="hdr-title">CigarHub</div>
              <div className="hdr-sub">Collection & Journal</div>
            </div>
          </div>
          <div className="hdr-right">
            {tab==="collection"&&<>
              <button className={`sort-btn${showSearch?" active":""}`} onClick={()=>{setShowSearch(s=>!s);if(showSearch)setSearchQ("");}}>
                {Icon.search}<span>Search</span>
              </button>
              <button className="sort-btn" onClick={()=>setSortBy(s=>s==="date"?"brand":s==="brand"?"rating":"date")}>
                Sort: {sortBy==="date"?"Newest":sortBy==="brand"?"Brand":"Rating"}
              </button>
            </>}
          </div>
        </div>

        {/* ── Search bar (slides in) ── */}
        {showSearch&&tab==="collection"&&(
          <div className="search-bar">
            {Icon.search}
            <input className="search-input" autoFocus placeholder="Search cigars, brands, origins…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
            {searchQ&&<button className="search-clear" onClick={()=>setSearchQ("")}>×</button>}
          </div>
        )}

        {/* ── Main content ── */}
        <div className="content">

          {/* Stats */}
          <div className="stats-strip">
            <div className="stat-card">
              <div className="stat-label">In Humidor</div>
              <div className="stat-value">{humidorCount}</div>
              <div className="stat-sub">cigars ready</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Smoked</div>
              <div className="stat-value">{totalSmoked}</div>
              <div className="stat-sub">total logged</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Wishlist</div>
              <div className="stat-value">{wishlistCount}</div>
              <div className="stat-sub">to try</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg Rating</div>
              <div className="stat-value">{avgRating}</div>
              <div className="stat-sub">out of 10</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-label">Avg MSRP</div>
              <div className="stat-value">${avgMsrp.toFixed(2)}</div>
              <div className="stat-sub">{allMsrpVals.length} pts · shared</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Avg Cost</div>
              <div className="stat-value">${avgCost.toFixed(2)}</div>
              <div className="stat-sub">what you paid</div>
            </div>
          </div>

          {/* ── Collection Tab ── */}
          {tab==="collection"&&(<>
            <div className="sec-hdr">
              <div><span className="sec-title">My Collection</span><span className="sec-count">{filteredCigars.length} cigars</span></div>
            </div>
            <div className="filter-row">
              {["All","In Humidor","Smoked","Wishlist"].map(f=>(
                <button key={f} className={`fchip${filter===f?" active":""}`} onClick={()=>setFilter(f)}>{f}</button>
              ))}
            </div>

            {filteredCigars.length===0
              ?<div className="empty">
                <div className="empty-icon">🚬</div>
                <div className="empty-title">{searchQ?"No cigars match your search":"No cigars here yet"}</div>
                <div className="empty-sub">{searchQ?`Try a different search term`:filter!=="All"?`No cigars with status "${filter}"`:"Tap + to add your first stick"}</div>
              </div>
              :<div className="cigar-grid">
                {filteredCigars.map(c=>(
                  <div key={c.id} className="ccard">
                    <input type="file" accept="image/*" style={{display:"none"}} ref={el=>fileRefs.current[c.id]=el} onChange={e=>{
                      const f=e.target.files[0];if(!f)return;
                      const r=new FileReader();r.onload=ev=>setCigars(p=>p.map(x=>x.id===c.id?{...x,photo:ev.target.result}:x));r.readAsDataURL(f);
                    }}/>
                    <div className="ccard-photo-wrap">
                      {c.photo
                        ?<><img src={c.photo} className="ccard-photo" alt={c.name} onClick={()=>fileRefs.current[c.id]?.click()}/><div className="ccard-photo-gradient"/></>
                        :<div className="ccard-photo-placeholder" onClick={()=>fileRefs.current[c.id]?.click()}>
                          <div style={{color:C.textDim,width:24,height:24}}>{Icon.camera}</div>
                          <span className="photo-hint">Tap to add photo</span>
                        </div>
                      }
                    </div>
                    <div className="ccard-body">
                      <div>
                        <div className="ccard-name">{c.name||c.brand}</div>
                        <div className="ccard-brand">{c.brand}</div>
                        <div className="ccard-vitola">{c.vitola} · {c.origin}</div>
                      </div>
                      <StrengthBar strength={c.strength}/>
                      <div className="ccard-meta">
                        <div className="ccard-row"><span className="ccard-lbl">Wrapper</span><span className="ccard-val">{c.wrapper}</span></div>
                        <div className="ccard-row"><span className="ccard-lbl">Your Cost</span><span className="ccard-val green">${c.cost.toFixed(2)}</span></div>
                        <div className="ccard-row"><span className="ccard-lbl">MSRP</span><span className="ccard-val gold">${c.msrp.toFixed(2)}</span></div>
                        {c.msrp>0&&c.cost>0&&<div className="ccard-row"><span className="ccard-lbl">Savings</span><span className="ccard-val green">{Math.round((1-c.cost/c.msrp)*100)}%</span></div>}
                      </div>
                      <div className="ccard-footer">
                        <button className={`status-pill ${statusClass(c.status)}`} onClick={()=>cycleStatus(c.id)} title="Tap to change status">
                          {c.status}
                        </button>
                        <span className="qty-badge">×{c.qty}</span>
                      </div>
                      <div className="ccard-actions" style={{marginTop:8}}>
                        <button className="ccard-btn" onClick={()=>{setLogForm(p=>({...p,cigarId:String(c.id)}));setShowAddLog(true);}}>Log smoke</button>
                        <button className="ccard-btn flag" onClick={()=>flagName(c.brand,c.name)}>⚑ Flag</button>
                        <button className="ccard-btn danger" onClick={()=>{setCigars(p=>p.filter(x=>x.id!==c.id));showToast("Removed from collection");}}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </>)}

          {/* ── Tasting Log Tab ── */}
          {tab==="tasting log"&&(<>
            <div className="sec-hdr">
              <div><span className="sec-title">Tasting Notes</span><span className="sec-count">{logs.length} entries</span></div>
            </div>
            {logs.length===0
              ?<div className="empty">
                <div className="empty-icon">📓</div>
                <div className="empty-title">No tasting notes yet</div>
                <div className="empty-sub">Log your next smoke and start building your journal</div>
              </div>
              :<div className="log-list">
                {[...logs].reverse().map(l=>{
                  const c=getCigar(l.cigarId);
                  return(
                    <div key={l.id} className="log-card">
                      <div className="log-top">
                        <div className="log-left">
                          <div className="log-cigar">{c?`${c.name||c.brand}`:"Unknown Cigar"}</div>
                          <div className="log-vitola">{c?`${c.brand} · ${c.vitola}`:""}</div>
                          <div className="log-date">{new Date(l.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
                        </div>
                        <div className="score-circle">
                          <span className="score-num">{l.rating}</span>
                          <span className="score-denom">/10</span>
                        </div>
                      </div>
                      <div className="log-scores">
                        <span className="score-mini">Draw <span>{l.draw}/10</span></span>
                        <span className="score-mini">Burn <span>{l.burn}/10</span></span>
                      </div>
                      {l.notes&&<div className="log-notes">"{l.notes}"</div>}
                      {l.flavors?.length>0&&<div className="log-tags">{l.flavors.map(f=><span key={f} className="log-tag">{f}</span>)}</div>}
                      {l.pairings?.length>0&&<div className="log-pairings">{l.pairings.map(p=><span key={p} className="pairing-tag">🥃 {p}</span>)}</div>}
                    </div>
                  );
                })}
              </div>
            }
          </>)}

          {/* ── Insights Tab ── */}
          {tab==="insights"&&(<>
            <div className="sec-hdr"><span className="sec-title">Insights</span></div>

            <div className="insight-card accent-l">
              <div className="insight-label">Avg MSRP — {allMsrpVals.length} shared data points</div>
              <div className="insight-value">${avgMsrp.toFixed(2)}</div>
              <div className="insight-sub">IQR outlier removal · community pool</div>
            </div>
            <div className="insight-card success-l">
              <div className="insight-label">Avg Cost You Paid</div>
              <div className="insight-value success">${avgCost.toFixed(2)}</div>
              <div className="insight-sub">{costVals.length} cigars with cost data</div>
            </div>
            {avgMsrp>0&&avgCost>0&&(
              <div className="insight-card gold-l">
                <div className="insight-label">Avg Savings vs MSRP</div>
                <div className="insight-value gold">{((1-avgCost/avgMsrp)*100).toFixed(1)}%</div>
                <div className="insight-sub">${(avgMsrp-avgCost).toFixed(2)} below retail on average</div>
              </div>
            )}

            {cigars.length>0&&(<>
              <div className="divider"/>
              <div className="section-divider">Top Brands</div>
              {brandStats.map(([b,n])=>(
                <div key={b} className="bar-row">
                  <div className="bar-label">{b}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${(n/brandStats[0][1])*100}%`}}/></div>
                  <div className="bar-count">{n}</div>
                </div>
              ))}

              <div className="divider"/>
              <div className="section-divider">Top Origins</div>
              {originStats.map(([o,n])=>(
                <div key={o} className="bar-row">
                  <div className="bar-label">{o}</div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${(n/cigars.length)*100}%`,background:C.gold}}/></div>
                  <div className="bar-count">{n}</div>
                </div>
              ))}
            </>)}

            {topRated.length>0&&(<>
              <div className="divider"/>
              <div className="section-divider">Top Rated Smokes</div>
              {topRated.map((l,i)=>{
                const c=getCigar(l.cigarId);
                return(
                  <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:C.text}}>{c?`${c.name||c.brand}`:""}</div>
                      <div style={{fontSize:11,color:C.textDim,fontWeight:500}}>{c?.vitola} · {new Date(l.date).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.accent}}>{l.rating}</span>
                      <span style={{fontSize:11,color:C.textDim}}>/10</span>
                    </div>
                  </div>
                );
              })}
            </>)}

            {cigars.length>0&&(<>
              <div className="divider"/>
              <div className="section-divider">Strength Distribution</div>
              {STRENGTHS.map(s=>{
                const n=cigars.filter(c=>c.strength===s).length;
                if(!n)return null;
                return(
                  <div key={s} className="bar-row">
                    <div className="bar-label" style={{color:STRENGTH_COLORS[s]}}>{s.replace('-',' ')}</div>
                    <div className="bar-track"><div className="bar-fill" style={{width:`${(n/cigars.length)*100}%`,background:STRENGTH_COLORS[s]}}/></div>
                    <div className="bar-count">{n}</div>
                  </div>
                );
              })}
            </>)}

            <div style={{marginTop:16,fontSize:10,color:C.textDim,textAlign:"center",fontWeight:500}}>
              Device ID: <span style={{fontFamily:"monospace"}}>{deviceId.slice(0,8)}</span>
            </div>
          </>)}
        </div>

        {/* ── FAB ── */}
        <button className="fab" onClick={()=>openAdd(tab==="tasting log"?"log":"cigar")} title={tab==="tasting log"?"Log a Smoke":"Add Cigar"}>
          {Icon.plus}
        </button>

        {/* ── Bottom Nav ── */}
        <div className="bottom-nav">
          {[
            {id:"collection",label:"Collection",icon:Icon.smoke},
            {id:"tasting log",label:"Journal",icon:Icon.notebook},
            {id:"insights",label:"Insights",icon:Icon.chart},
          ].map(({id,label,icon})=>(
            <button key={id} className={`bnav-btn${tab===id?" active":""}`} onClick={()=>setTab(id)}>
              <div className="bnav-icon">{icon}</div>
              <span>{label}</span>
              <div className="bnav-indicator"/>
            </button>
          ))}
        </div>

        {/* ── Add Cigar Modal ── */}
        {showAddCigar&&(
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAddCigar(false)}>
            <div className="modal">
              <div className="modal-handle"/>
              <div className="modal-header">
                <div className="modal-title">Add to Collection</div>
                <button className="modal-close" onClick={()=>setShowAddCigar(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="fg full"><label className="form-label">Brand</label>
                    <select className="form-input" value={cigarForm.brand} onChange={e=>{setCigarForm({...EMPTY_FORM,brand:e.target.value});setNameInput("");setNameErr("");setAutoFilled(false);}}>
                      <option value="">Select a brand…</option>
                      {BRANDS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="fg full">
                    <label className="form-label">Cigar Name {autoFilled&&<span className="autofill-tag">✓ Auto-filled</span>}</label>
                    <div className="name-wrap">
                      <input className="form-input" placeholder={cigarForm.brand?"Search or enter name…":"Select a brand first"} disabled={!cigarForm.brand}
                        value={nameInput} autoComplete="off"
                        onChange={e=>{setNameInput(e.target.value);setShowSugg(true);setNameErr("");setAutoFilled(false);}}
                        onFocus={()=>setShowSugg(true)} onBlur={()=>setTimeout(()=>setShowSugg(false),150)}/>
                      {showSugg&&cigarForm.brand&&(nameSuggestions.length>0||nameInput.trim())&&(
                        <div className="suggestions">
                          {nameSuggestions.map(n=>{
                            const isV=(CIGAR_DB[cigarForm.brand]||[]).some(c=>c.name===n);
                            return(
                              <div key={n} className="suggestion-item" onMouseDown={()=>selectSuggestion(n)}>
                                <span>{n}</span>
                                <span className={`sbadge ${isV?"verified":"community"}`}>{isV?"VERIFIED":"COMMUNITY"}</span>
                              </div>
                            );
                          })}
                          {nameInput.trim()&&!nameSuggestions.map(n=>n.toLowerCase()).includes(nameInput.trim().toLowerCase())&&(
                            <div className="suggestion-item" style={{color:C.accent}} onMouseDown={()=>setShowSugg(false)}>
                              <span>Submit "{nameInput.trim()}" as new</span>
                              <span className="sbadge new">NEW</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {nameErr&&<div className="name-err">{nameErr}</div>}
                  </div>
                  <div className="fg"><label className="form-label">Vitola</label>
                    <select className="form-input" value={cigarForm.vitola} onChange={e=>setCigarForm(p=>({...p,vitola:e.target.value}))}>
                      {VITOLAS.map(v=><option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="form-label">Origin</label>
                    <select className="form-input" value={cigarForm.origin} onChange={e=>setCigarForm(p=>({...p,origin:e.target.value}))}>
                      {ORIGINS.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="fg full"><label className="form-label">Wrapper</label>
                    <select className="form-input" value={cigarForm.wrapper} onChange={e=>setCigarForm(p=>({...p,wrapper:e.target.value}))}>
                      {WRAPPER_TYPES.map(w=><option key={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="form-label">Strength</label>
                    <select className="form-input" value={cigarForm.strength} onChange={e=>setCigarForm(p=>({...p,strength:e.target.value}))}>
                      {STRENGTHS.map(s=><option key={s} value={s}>{s.replace('-',' ')}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="form-label">Status</label>
                    <select className="form-input" value={cigarForm.status} onChange={e=>setCigarForm(p=>({...p,status:e.target.value}))}>
                      {STATUSES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label className="form-label">Quantity</label>
                    <input className="form-input" type="number" min="0" value={cigarForm.qty} onChange={e=>setCigarForm(p=>({...p,qty:e.target.value}))}/>
                  </div>
                  <div className="fg"><label className="form-label">Your Cost ($)</label>
                    <input className="form-input" type="number" step="0.01" placeholder="0.00" value={cigarForm.cost} onChange={e=>setCigarForm(p=>({...p,cost:e.target.value}))}/>
                  </div>
                  <div className="fg"><label className="form-label">MSRP ($)</label>
                    <input className="form-input" type="number" step="0.01" placeholder="0.00" value={cigarForm.msrp} onChange={e=>setCigarForm(p=>({...p,msrp:e.target.value}))}/>
                  </div>
                  <div className="fg full"><label className="form-label">Date Acquired</label>
                    <input className="form-input" type="date" value={cigarForm.acquired} onChange={e=>setCigarForm(p=>({...p,acquired:e.target.value}))}/>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={()=>setShowAddCigar(false)}>Cancel</button>
                <button className="btn-primary" onClick={addCigar} disabled={!cigarForm.brand||!nameInput.trim()}>Add to Collection</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Log Modal ── */}
        {showAddLog&&(
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAddLog(false)}>
            <div className="modal">
              <div className="modal-handle"/>
              <div className="modal-header">
                <div className="modal-title">Log a Smoke</div>
                <button className="modal-close" onClick={()=>setShowAddLog(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="fg full"><label className="form-label">Cigar</label>
                    <select className="form-input" value={logForm.cigarId} onChange={e=>setLogForm(p=>({...p,cigarId:e.target.value}))}>
                      <option value="">Select a cigar…</option>
                      {cigars.map(c=><option key={c.id} value={c.id}>{c.name||c.brand} — {c.vitola}</option>)}
                    </select>
                  </div>
                  <div className="fg full"><label className="form-label">Date Smoked</label>
                    <input className="form-input" type="date" value={logForm.date} onChange={e=>setLogForm(p=>({...p,date:e.target.value}))}/>
                  </div>
                  <div className="fg full">
                    <label className="form-label">Overall Rating: {logForm.rating} / 10</label>
                    <div className="stars">
                      {[...Array(10)].map((_,i)=>(
                        <span key={i} className={`star${i<logForm.rating?" lit":""}`} onClick={()=>setLogForm(p=>({...p,rating:i+1}))}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="fg">
                    <label className="form-label">Draw: {logForm.draw}/10</label>
                    <input type="range" min="1" max="10" step="1" value={logForm.draw} onChange={e=>setLogForm(p=>({...p,draw:+e.target.value}))}/>
                  </div>
                  <div className="fg">
                    <label className="form-label">Burn: {logForm.burn}/10</label>
                    <input type="range" min="1" max="10" step="1" value={logForm.burn} onChange={e=>setLogForm(p=>({...p,burn:+e.target.value}))}/>
                  </div>
                  <div className="fg full">
                    <label className="form-label">Flavor Notes</label>
                    <div className="tag-picker">
                      {FLAVOR_TAGS.map(f=>(
                        <span key={f} className={`tpick${logForm.flavors.includes(f)?" sel":""}`}
                          onClick={()=>setLogForm(p=>({...p,flavors:p.flavors.includes(f)?p.flavors.filter(x=>x!==f):[...p.flavors,f]}))}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="fg full">
                    <label className="form-label">Pairings</label>
                    <div className="tag-picker">
                      {PAIRINGS.map(p=>(
                        <span key={p} className={`tpick pair${logForm.pairings.includes(p)?" sel":""}`}
                          onClick={()=>setLogForm(prev=>({...prev,pairings:prev.pairings.includes(p)?prev.pairings.filter(x=>x!==p):[...prev.pairings,p]}))}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="fg full">
                    <label className="form-label">Tasting Notes</label>
                    <textarea className="form-input" rows={3} style={{resize:"vertical"}} placeholder="Your impressions, aromas, evolution through thirds…" value={logForm.notes} onChange={e=>setLogForm(p=>({...p,notes:e.target.value}))}/>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={()=>setShowAddLog(false)}>Cancel</button>
                <button className="btn-primary" onClick={addLog} disabled={!logForm.cigarId}>Save Entry</button>
              </div>
            </div>
          </div>
        )}

        {toast&&<div className="toast">{toast}</div>}
      </div>
    </>
  );
}
