// Official Stanley/Stella measurements (product sheets, cm, garment laid flat).
// Source: res.cloudinary.com/www-stanleystella-com/.../Product Sheets/en_GB/<code>.pdf
export interface SizeChart { id: string; piece: string; model: string; code: string; soon: boolean; cols: [string, string][]; rows: (string | number)[][] }

export const SIZE_CHARTS: SizeChart[] = [
  { id: "tshirt", piece: "T-shirt", model: "Creator 2.0", code: "STTU169", soon: false, cols: [["A", "Half chest"], ["B", "Body length"], ["C", "Sleeve length"]], rows: [["XXS", 45.5, 62, 20], ["XS", 47.5, 65, 21], ["S", 49.5, 69, 22.5], ["M", 53.5, 73, 24], ["L", 56.5, 75, 24.5], ["XL", 59.5, 77, 25], ["XXL", 63.5, 79, 25.5], ["3XL", 67.5, 81, 26], ["4XL", 72.5, 83, 26], ["5XL", 77.5, 84, 26]] },
  { id: "hoodie", piece: "Hoodie", model: "Cruiser 2.0", code: "STSU177", soon: false, cols: [["A", "Half chest"], ["B", "Body length"], ["C", "Sleeve length"]], rows: [["XXS", 51, 64, 58.5], ["XS", 53, 67, 60.5], ["S", 55, 71, 64.5], ["M", 59, 74, 66.5], ["L", 62, 76, 68.5], ["XL", 65, 78, 69], ["XXL", 69, 80, 69.5], ["3XL", 73, 82, 69.5], ["4XL", 78, 84, 69.5], ["5XL", 83, 85, 69.5]] },
  { id: "tote", piece: "Tote bag", model: "Tote Bag", code: "STAU760", soon: false, cols: [["A", "Height"], ["C", "Width"], ["D", "Strap length"]], rows: [["OS", 39, 37, 65]] },
  { id: "women", piece: "Women's T-shirt", model: "Stella Muser", code: "STTW172", soon: true, cols: [["A", "Half chest"], ["B", "Body length"], ["C", "Sleeve length"]], rows: [["XS", 45, 56.5, 18], ["S", 48, 59.5, 18.5], ["M", 51, 61.5, 19], ["L", 54, 63.5, 19.5], ["XL", 57, 65.5, 20], ["XXL", 61, 67.5, 20.5], ["3XL", 65, 69.5, 21]] },
  { id: "bomber", piece: "Bomber jacket", model: "Bomber 2.0", code: "STJU251", soon: true, cols: [["A", "Half chest"], ["B", "Body length"], ["C", "Sleeve length"]], rows: [["XXS", 56, 61.5, 63.5], ["XS", 58, 64.5, 65], ["S", 60, 67.5, 66.5], ["M", 64, 69.5, 68], ["L", 67, 71.5, 70], ["XL", 70, 73.5, 71.5], ["XXL", 74, 76, 72.5], ["3XL", 78, 78, 72.5]] },
  { id: "beanie", piece: "Beanie", model: "Fisherman Beanie", code: "STAU771", soon: true, cols: [["A", "Height"], ["C", "Width"]], rows: [["OS", 27, 20.5]] },
]
