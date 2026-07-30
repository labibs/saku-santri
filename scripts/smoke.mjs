import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
})

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /Masuk ke SakuSantri/i }).click()
  await page.getByRole('heading', { name: /Assalamu/i }).waitFor()
  await page.mouse.move(1000, 30)
  await page.waitForTimeout(400)
  await page.screenshot({ path: '/private/tmp/sakusantri-admin.png', fullPage: true })
  await page.locator('.sidebar').hover()
  await page.waitForTimeout(300)
  await page.screenshot({ path: '/private/tmp/sakusantri-sidebar-hover.png', fullPage: true })

  await page.getByRole('button', { name: 'Keuangan Santri', exact: true }).click()
  await page.getByRole('button', { name: /Tagihan SPP/i }).click()
  await page.getByRole('heading', { name: 'Tagihan SPP' }).waitFor()
  await page.getByRole('button', { name: /Catat bayar/i }).first().click()
  await page.getByRole('heading', { name: 'Catat pembayaran' }).waitFor()
  await page.getByRole('button', { name: 'Batal' }).click()

  await page.locator('.sidebar').hover()
  await page.getByRole('button', { name: 'Iuran', exact: true }).click()
  await page.getByRole('heading', { name: 'Iuran Pondok' }).waitFor()
  await page.screenshot({ path: '/private/tmp/sakusantri-iuran.png', fullPage: true })
  await page.getByRole('button', { name: 'Verifikasi' }).first().click()
  await page.getByText(/masuk ke Buku Kas/i).waitFor()

  await page.locator('.sidebar').hover()
  await page.getByRole('button', { name: 'Tabungan Santri', exact: true }).click()
  await page.getByRole('heading', { name: 'Tabungan Santri' }).waitFor()
  await page.screenshot({ path: '/private/tmp/sakusantri-tabungan.png', fullPage: true })
  await page.getByRole('button', { name: 'Setor', exact: true }).first().click()
  await page.getByLabel('Nominal').fill('125000')
  await page.getByRole('button', { name: 'Simpan setoran' }).click()
  await page.getByText(/Setoran tersimpan dan masuk ke Buku Kas/i).waitFor()

  await page.locator('.sidebar').hover()
  await page.getByRole('button', { name: 'Buku Kas', exact: true }).click()
  await page.getByRole('heading', { name: 'Buku Kas' }).waitFor()
  await page.getByText('Setoran tabungan — Ahmad Fadhil').first().waitFor()
  await page.screenshot({ path: '/private/tmp/sakusantri-cash-integrated.png', fullPage: true })

  await page.locator('.sidebar').hover()
  await page.getByRole('button', { name: 'Pengaturan', exact: true }).click()
  await page.getByRole('heading', { name: 'Pengaturan', exact: true }).waitFor()
  const demoLogo = { name: 'demo-logo.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0f766e"/><circle cx="32" cy="32" r="15" fill="#fbbf24"/></svg>') }
  await page.locator('.app-branding-card input[type="file"]').first().setInputFiles(demoLogo)
  await page.locator('.sidebar-brand .logo-mark.has-image img').waitFor()
  await page.locator('.app-branding-card input[type="file"]').nth(1).setInputFiles(demoLogo)
  await page.waitForFunction(() => document.querySelector('link[rel="icon"]')?.getAttribute('href')?.startsWith('data:image/svg+xml'))
  await page.locator('.institution-card input[type="file"]').setInputFiles(demoLogo)
  await page.locator('.school-chip .has-image img').waitFor()
  await page.screenshot({ path: '/private/tmp/sakusantri-branding-settings.png', fullPage: true })
  await page.reload({ waitUntil: 'networkidle' })
  await page.locator('.login-brand .logo-mark.has-image img').waitFor()
  await page.waitForFunction(() => document.querySelector('link[rel="icon"]')?.getAttribute('href')?.startsWith('data:image/svg+xml'))

  const adminMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await adminMobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await adminMobile.getByRole('button', { name: /Masuk ke SakuSantri/i }).click()
  await adminMobile.getByRole('heading', { name: /Assalamu/i }).waitFor()
  await adminMobile.screenshot({ path: '/private/tmp/sakusantri-dashboard-mobile.png', fullPage: true })

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
  await mobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await mobile.getByRole('button', { name: 'Wali Santri' }).click()
  await mobile.getByRole('button', { name: /Masuk ke SakuSantri/i }).click()
  await mobile.getByRole('heading', { name: /Assalamu/i }).waitFor()
  await mobile.screenshot({ path: '/private/tmp/sakusantri-mobile.png', fullPage: true })
  await mobile.getByRole('button', { name: 'Buka menu' }).click()
  await mobile.getByRole('button', { name: 'Keuangan Santri', exact: true }).click()
  await mobile.getByRole('button', { name: 'Tagihan SPP', exact: true }).click()
  await mobile.getByRole('heading', { name: 'Tagihan SPP' }).waitFor()
  await mobile.getByRole('button', { name: 'Buka menu' }).click()
  await mobile.getByRole('button', { name: 'Iuran', exact: true }).click()
  await mobile.getByRole('heading', { name: 'Iuran Pondok' }).waitFor()
  await mobile.waitForTimeout(300)
  await mobile.screenshot({ path: '/private/tmp/sakusantri-iuran-mobile.png', fullPage: true })
  await mobile.getByRole('button', { name: 'Buka menu' }).click()
  await mobile.getByRole('button', { name: 'Tabungan Santri', exact: true }).click()
  await mobile.getByRole('heading', { name: 'Tabungan Santri' }).waitFor()
  await mobile.waitForTimeout(300)
  await mobile.screenshot({ path: '/private/tmp/sakusantri-tabungan-mobile.png', fullPage: true })

  console.log('Smoke test lulus: SPP, verifikasi Iuran, setoran Tabungan, integrasi Buku Kas, serta portal Wali Santri desktop/mobile.')
} finally {
  await browser.close()
}
