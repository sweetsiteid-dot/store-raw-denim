/**
 * Fungsi utama untuk melayani tampilan web
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('RAW & INDIGO - Premium Raw Denim Store')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * SETUP DATABASE (Jalankan fungsi ini sekali dari editor Apps Script)
 * Akan membuat spreadsheet baru bernama "Raw_Denim_Store_DB" beserta Sheet Produk & Pesanan.
 */
function setupDatabase() {
  var ss = SpreadsheetApp.create('Raw_Denim_Store_DB');
  
  // Sheet 1: Produk
  var sheetProduk = ss.getActiveSheet();
  sheetProduk.setName('Produk');
  sheetProduk.appendRow(['ID', 'Nama Produk', 'Berat (Oz)', 'Fit', 'Harga', 'Stok', 'Gambar URL', 'Deskripsi']);
  
  // Tambahkan data sampel Raw Denim
  sheetProduk.appendRow([
    'RD01', 
    'Heavyweight Selvedge Jeans', 
    '18 Oz', 
    'Slim Straight', 
    1250000, 
    15, 
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80', 
    'Deep indigo rope-dyed selvedge denim dengan karakter kaku dan kontras fade yang tajam.'
  ]);
  sheetProduk.appendRow([
    'RD02', 
    'Unsanforized Japanese Denim', 
    '15 Oz', 
    'Regular Straight', 
    1450000, 
    10, 
    'https://images.unsplash.com/photo-1542272604-780c36856d61?auto=format&fit=crop&w=600&q=80', 
    '100% Japanese Cotton, loomstate, merah selvedge line. Perlu inisial soak.'
  ]);
  sheetProduk.appendRow([
    'RD03', 
    'Indigo x Indigo Rider Jacket', 
    '16 Oz', 
    'Slim Fit', 
    1650000, 
    8, 
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80', 
    'Double indigo warp & weft. Menghasilkan warna indigo pekat luar dalam.'
  ]);

  // Format Header Produk
  sheetProduk.getRange("A1:H1").setFontWeight("bold").setBackground("#1a2b4c").setFontColor("#ffffff");

  // Sheet 2: Pesanan
  var sheetPesanan = ss.insertSheet('Pesanan');
  sheetPesanan.appendRow(['ID Pesanan', 'Tanggal', 'Nama Pelanggan', 'WhatsApp', 'Produk', 'Ukuran', 'Total Harga', 'Status']);
  sheetPesanan.getRange("A1:H1").setFontWeight("bold").setBackground("#1a2b4c").setFontColor("#ffffff");

  // Simpan ID Spreadsheet ke Script Properties agar otomatis terhubung
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

  Logger.log('Database berhasil dibuat!');
  Logger.log('URL Spreadsheet: ' + ss.getUrl());
}

/**
 * Mengambil daftar produk dari Database Google Sheets
 */
function getProducts() {
  var ssId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!ssId) return [];

  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Produk');
  var data = sheet.getDataRange().getValues();
  var products = [];

  // Lewati baris header (index 0)
  for (var i = 1; i < data.length; i++) {
    products.push({
      id: data[i][0],
      name: data[i][1],
      oz: data[i][2],
      fit: data[i][3],
      price: data[i][4],
      stock: data[i][5],
      image: data[i][6],
      description: data[i][7]
    });
  }
  return products;
}

/**
 * Menyimpan pesanan baru ke Google Sheets
 */
function submitOrder(orderData) {
  var ssId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!ssId) throw new Error('Database belum disiapkan. Jalankan setupDatabase() terlebih dahulu.');

  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('Pesanan');
  var orderId = 'ORD-' + new Date().getTime().toString().slice(-6);
  var date = new Date().toLocaleString('id-ID');

  sheet.appendRow([
    orderId,
    date,
    orderData.name,
    orderData.phone,
    orderData.productName,
    orderData.size,
    orderData.price,
    'Pending'
  ]);

  return { success: true, orderId: orderId };
}
