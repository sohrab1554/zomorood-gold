/* =========================================================
   ZOMOROD GOLD — script.js  (luxury edition)

   ⚠ SECURITY NOTE (read before backend phase):
   Every "MOCK BACKEND" function below uses localStorage only
   to demo the UI flow (manager approval, coworker pricing,
   admin CMS, cart). None of it is secure. In production:
     • move all password checks + approval logic to the server
     • authenticate every request (session token / JWT)
     • compute prices & discounts server-side; never trust client
     • hash national codes / passwords; never store plaintext
   Search for "TODO backend" markers to find each swap point.
   ========================================================= */

/* ---------------- state (declared first to avoid TDZ) ---------------- */
let currentLang = localStorage.getItem('zg_lang') || 'fa';
let CURRENT_COWORKER = JSON.parse(sessionStorage.getItem('zg_coworker_session') || 'null');
let activeCategory = 'all';
let currentSort = 'default';
let cart = JSON.parse(localStorage.getItem('zg_cart') || '[]');
let favs = JSON.parse(localStorage.getItem('zg_favs') || '[]');
let goldPricePerGram = Number(localStorage.getItem('zg_gold_base')) || 6350000;
let particleTheme = localStorage.getItem('zg_theme') || 'light';
let productImages = JSON.parse(localStorage.getItem('zg_product_images') || '{}');

/* ================= i18n ================= */
const I18N = {
 fa:{ dir:'rtl',
  loaderText:'در حال آماده‌سازی گنجینه شما...',
  marquee:'✨ زمرد گلد؛ خلوص، اعتماد و درخشش در هر قیراط — ارسال سریع و ضمانت اصالت کالا ✦ گارانتی بازخرید و تعویض ✦ مشاوره رایگان انتخاب جواهر ✦ گواهی خلوص همراه هر سفارش ✨',
  navHome:'خانه', navCategories:'دسته‌بندی', navProducts:'محصولات', navGallery:'گالری', navAbout:'درباره ما', navBlog:'مجله طلا', navSupport:'پشتیبانی', navContact:'ارتباط با ما',
  goldPriceLabel:'۱۸ عیار',
  heroEyebrow:'درخشش اصیل، اعتماد ماندگار', heroTitle1:'جواهری که', heroTitle2:'داستان شما', heroTitle3:'را روایت می‌کند',
  heroDesc:'زمرد گلد؛ گزیده‌ای از خالص‌ترین طلا و جواهرات دست‌ساز، با قیمت شفاف و لحظه‌ای، تحویل درب منزل و ضمانت اصالت کالا همراه با گواهی خلوص.',
  heroBtn1:'مشاهده محصولات', heroBtn2:'مشاوره رایگان',
  statYears:'سال تجربه', statClients:'مشتری راضی', statGuarantee:'ضمانت اصالت',
  categoriesEyebrow:'مجموعه‌ها', categoriesTitle:'دسته‌بندی محصولات',
  productsEyebrow:'ویترین', productsTitle:'محصولات زمرد گلد', productsSub:'قیمت‌ها بر اساس نرخ لحظه‌ای طلا و اجرت ساخت، به‌صورت خودکار محاسبه می‌شود.',
  sortLabel:'مرتب‌سازی:', sortDefault:'پیش‌فرض', sortPriceAsc:'ارزان‌ترین', sortPriceDesc:'گران‌ترین', sortWeight:'وزن بیشتر',
  galleryEyebrow:'لحظه‌های درخشان', galleryTitle:'گالری زمرد گلد',
  aboutBadge:'از ۱۳۸۵', aboutEyebrow:'داستان برند', aboutTitle:'میراثی از خلوص و هنر',
  aboutText1:'زمرد گلد از دل یک کارگاه کوچک زرگری در بازار قدیمی آغاز شد؛ جایی که هر قطعه با دست و با عشق ساخته می‌شد. امروز پس از بیش از یک دهه، همان اصالت را با فناوری روز و قیمت‌گذاری کاملاً شفاف به خانه‌ی شما می‌آوریم.',
  aboutText2:'باور ما ساده است: طلا فقط فلز نیست، حافظه‌ی لحظه‌هاست. برای همین روی هر قطعه گواهی خلوص و اصالت می‌گذاریم و ضمانت بازخرید می‌دهیم.',
  guideEyebrow:'راهنمای خرید', guideTitle:'چگونه طلای درست را انتخاب کنیم؟',
  testiEyebrow:'اعتماد شما', testiTitle:'نظرات مشتریان',
  blogEyebrow:'مجله طلا', blogTitle:'تازه‌ترین مقالات',
  supportEyebrow:'در کنار شما', supportTitle:'پشتیبانی',
  contactEyebrow:'گفتگو با ما', contactTitle:'ارتباط با ما', contactIntro:'سوالی دارید یا به مشاوره نیاز دارید؟ فرم را پر کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند.',
  contactName:'نام و نام خانوادگی', contactPhone:'شماره تماس', contactMsg:'پیام شما', contactSend:'ارسال پیام',
  contactAddrLabel:'آدرس:', contactAddr:'تهران، خیابان طلافروشان، پاساژ زمرد', contactEmailLabel:'ایمیل:', contactPhoneLabel:'تلفن:',
  coworkerBtn:'ورود همکاران', managerBtn:'ورود مدیریت',
  newsTitle:'از تخفیف‌ها و کالکشن‌های جدید باخبر شوید', newsDesc:'ایمیل خود را وارد کنید تا اولین نفری باشید که از پیشنهادهای ویژه مطلع می‌شود.', newsPh:'ایمیل شما', newsBtn:'عضویت',
  footerAbout:'خانه‌ی طلا و جواهرات فاخر، با ضمانت اصالت و گواهی خلوص همراه هر سفارش.', footerLinks:'دسترسی سریع', footerHelp:'پشتیبانی', footerFaq:'سوالات متداول', footerShipping:'ارسال و مرجوعی', footerWarranty:'گارانتی و بازخرید', footerSocial:'ما را دنبال کنید', footerText:'© تمامی حقوق برای زمرد گلد محفوظ است.',
  loginTab:'ورود', signupTab:'ثبت‌نام', phInputPhone:'شماره موبایل', phInputPass:'رمز عبور', phInputFullname:'نام و نام خانوادگی', loginBtn:'ورود به حساب', signupBtn:'ایجاد حساب',
  coworkerRegTitle:'فرم ثبت‌نام همکاران', coworkerRegNote:'پس از تکمیل فرم، درخواست شما برای مدیر ارسال می‌شود و پس از تایید، امکان ورود به پنل همکاری فراهم می‌گردد.',
  phFirstName:'نام', phLastName:'نام خانوادگی', phNationalCode:'کد ملی', coworkerSubmit:'ارسال درخواست',
  coworkerPendingTitle:'درخواست شما ثبت شد', coworkerPendingNote:'درخواست همکاری شما در انتظار تایید مدیر است. پس از تایید می‌توانید با شماره تماس و کد ملی وارد پنل همکاری شوید.',
  coworkerLoginTitle:'ورود به پنل همکاری', coworkerLoginBtn:'ورود', coworkerNoAccount:'هنوز ثبت‌نام نکرده‌اید؟ ثبت‌نام',
  managerLoginTitle:'ورود مدیریت', managerLoginNote:'این بخش صرفاً برای مدیر سایت است.', phUsername:'نام کاربری', managerLoginBtn:'ورود به داشبورد مدیریت',
  managerDashTitle:'داشبورد مدیریت', pendingAdmins:'درخواست‌های دسترسی ادمین', pendingCoworkers:'درخواست‌های همکاری', goToAdminLogin:'ورود به پنل ادمین',
  adminLoginTitle:'ورود پنل ادمین', adminLoginNote:'ورود به این پنل نیازمند تایید مدیر است.', adminLoginBtn:'ورود',
  adminPanelTitle:'پنل مدیریت محتوا', adminPanelNote:'ویرایش قیمت پایه طلا، درصد تخفیف همکاران، متن نوار بالای سایت و تصاویر محصولات.',
  adminGoldBase:'قیمت هر گرم طلای ۱۸ عیار (تومان)', adminDiscount:'درصد تخفیف همکاران', adminMarquee:'متن نوار بالای سایت', adminProductImg:'آپلود تصویر برای محصول', adminSave:'ذخیره تغییرات',
  cartTitle:'سبد خرید', cartEmpty:'سبد خرید شما خالی است.', cartTotal:'مجموع:', cartCheckout:'تکمیل خرید',
  karat:'عیار', weight:'وزن', wage:'اجرت', category:'دسته', addToCart:'افزودن به سبد', coworkerPrice:'قیمت همکار',
  pendingEmpty:'موردی برای بررسی وجود ندارد.', approve:'تایید', saved:'تغییرات با موفقیت ذخیره شد.',
  gram:'گرم', toman:'تومان', all:'همه', added:'به سبد اضافه شد', imgUploaded:'تصویر ذخیره شد', readMore:'ادامه مطلب ←', purity:'خلوص',
  trust1t:'ضمانت اصالت', trust1s:'گواهی خلوص همراه هر خرید', trust2t:'ارسال سریع', trust2s:'بسته‌بندی امن و بیمه‌شده', trust3t:'بازخرید تضمینی', trust3s:'خرید طلای شما با بالاترین نرخ', trust4t:'پرداخت امن', trust4s:'درگاه بانکی معتبر و رمزنگاری‌شده',
  navTools:'ابزار طلا', navVerify:'استعلام اصالت',
  toolsEyebrow:'ابزارهای هوشمند', toolsTitle:'ابزار طلای زمرد', toolsSub:'قیمت لحظه‌ای، ماشین‌حساب طلا و تخمین بازخرید؛ همه در یک جا.',
  chartTitle:'روند قیمت طلا', chartNote:'هر گرم طلای ۱۸ عیار — ۷ روز اخیر',
  calcTitle:'ماشین‌حساب طلا', calcNote:'وزن و عیار را وارد کنید تا قیمت تقریبی را ببینید.', calcWeight:'وزن (گرم)', calcKarat:'عیار', calcWage:'اجرت (%)', calcTotal:'قیمت تقریبی:',
  buybackTitle:'محاسبه‌گر بازخرید', buybackNote:'طلای شما امروز چقدر می‌ارزد؟ (تخمینی)', buybackWeight:'وزن طلای شما (گرم)', buybackKarat:'عیار', buybackValue:'ارزش بازخرید:', buybackFine:'* مبلغ نهایی پس از کارشناسی حضوری تعیین می‌شود.',
  verifyEyebrow:'اصالت تضمین‌شده', verifyTitle:'استعلام اصالت کالا', verifyIntro:'هر قطعه‌ی زمرد گلد یک شماره سریال یکتا و گواهی اصالت دیجیتال دارد. شماره سریال روی فاکتور یا کد QR گواهی را وارد کنید تا اصالت آن را ببینید.', verifyPh:'مثال: ZG-18-0007-XXXX', verifyBtn:'استعلام', verifyHint:'نمونه برای تست: روی هر محصول دکمه‌ی «گواهی اصالت» را بزنید تا سریال آن را ببینید.',
  verifyOk:'✓ اصیل است', verifyOkText:'این شماره سریال متعلق به یک محصول اصل زمرد گلد است.', verifyFail:'✕ یافت نشد', verifyFailText:'شماره سریال واردشده در سامانه ثبت نشده است. لطفاً دوباره بررسی کنید.',
  badge1:'اتحادیه طلا و جواهر', badge2:'نماد اعتماد الکترونیکی', badge3:'درگاه بانکی امن', badge4:'گواهی خلوص بین‌المللی',
  certBtn:'گواهی اصالت', certTitle:'گواهی اصالت', certSerial:'شماره سریال', certIssued:'تاریخ صدور', certAuthentic:'اصالت تاییدشده', certDesc:'این گواهی تایید می‌کند که قطعه‌ی زیر با مشخصات ذکرشده، محصول اصل زمرد گلد است.', certVerify:'استعلام آنلاین', certCopy:'کپی شماره سریال', certCopied:'کپی شد',
  compareBtn:'افزودن به مقایسه', compareTitle:'مقایسه محصولات', compareTray:'مقایسه:', compareOpen:'مقایسه کن', compareEmpty:'برای مقایسه، محصولی انتخاب نشده است.', compareFull:'حداکثر ۳ محصول قابل مقایسه است.', compareAdded:'به مقایسه اضافه شد', compareName:'محصول', compareRemove:'حذف'
 },
 en:{ dir:'ltr',
  loaderText:'Preparing your treasury...',
  marquee:'✨ Zomorod Gold — purity, trust & radiance in every karat — fast delivery & authenticity guarantee ✦ Buy-back & exchange warranty ✦ Free jewelry consultation ✦ Purity certificate with every order ✨',
  navHome:'Home', navCategories:'Categories', navProducts:'Products', navGallery:'Gallery', navAbout:'About', navBlog:'Magazine', navSupport:'Support', navContact:'Contact',
  goldPriceLabel:'18k',
  heroEyebrow:'Authentic Radiance, Lasting Trust', heroTitle1:'Jewelry that', heroTitle2:'tells your', heroTitle3:'story',
  heroDesc:'Zomorod Gold — a curated selection of the purest gold and handcrafted jewelry, with transparent live pricing, doorstep delivery and an authenticity guarantee with purity certificate.',
  heroBtn1:'Browse Products', heroBtn2:'Free Consultation',
  statYears:'Years of experience', statClients:'Happy clients', statGuarantee:'Authenticity guarantee',
  categoriesEyebrow:'Collections', categoriesTitle:'Shop by Category',
  productsEyebrow:'Showcase', productsTitle:'Zomorod Gold Products', productsSub:'Prices are calculated automatically from the live gold rate and making charge.',
  sortLabel:'Sort:', sortDefault:'Default', sortPriceAsc:'Lowest price', sortPriceDesc:'Highest price', sortWeight:'Heaviest',
  galleryEyebrow:'Radiant Moments', galleryTitle:'Zomorod Gold Gallery',
  aboutBadge:'Since 2006', aboutEyebrow:'Brand Story', aboutTitle:'A Heritage of Purity & Craft',
  aboutText1:'Zomorod Gold began in a small goldsmith workshop in the old bazaar, where every piece was made by hand and with love. Over a decade later, we bring that same authenticity to your home with modern technology and fully transparent pricing.',
  aboutText2:'Our belief is simple: gold is not just metal, it is the memory of moments. That is why every piece carries a certificate of purity and authenticity, with a buy-back guarantee.',
  guideEyebrow:'Buying Guide', guideTitle:'How to Choose the Right Gold?',
  testiEyebrow:'Your Trust', testiTitle:'Customer Reviews',
  blogEyebrow:'Gold Magazine', blogTitle:'Latest Articles',
  supportEyebrow:'By Your Side', supportTitle:'Support',
  contactEyebrow:'Talk to Us', contactTitle:'Contact Us', contactIntro:'Have a question or need advice? Fill out the form and our specialists will contact you as soon as possible.',
  contactName:'Full name', contactPhone:'Phone number', contactMsg:'Your message', contactSend:'Send Message',
  contactAddrLabel:'Address:', contactAddr:'Tehran, Jewelers Street, Zomorod Passage', contactEmailLabel:'Email:', contactPhoneLabel:'Phone:',
  coworkerBtn:'Partner Login', managerBtn:'Manager Login',
  newsTitle:'Stay updated on offers & new collections', newsDesc:'Enter your email to be the first to hear about special offers.', newsPh:'Your email', newsBtn:'Subscribe',
  footerAbout:'A home of fine gold and jewelry, with authenticity guarantee and purity certificate on every order.', footerLinks:'Quick Links', footerHelp:'Support', footerFaq:'FAQ', footerShipping:'Shipping & Returns', footerWarranty:'Warranty & Buy-back', footerSocial:'Follow Us', footerText:'© All rights reserved to Zomorod Gold.',
  loginTab:'Login', signupTab:'Sign up', phInputPhone:'Mobile number', phInputPass:'Password', phInputFullname:'Full name', loginBtn:'Sign in', signupBtn:'Create account',
  coworkerRegTitle:'Partner Registration Form', coworkerRegNote:'After submitting, your request is sent to the manager. Once approved, you can log in to the partner panel.',
  phFirstName:'First name', phLastName:'Last name', phNationalCode:'National ID', coworkerSubmit:'Submit Request',
  coworkerPendingTitle:'Your request has been submitted', coworkerPendingNote:'Your partner request is pending manager approval. Once approved, log in with your phone number and national ID.',
  coworkerLoginTitle:'Partner Panel Login', coworkerLoginBtn:'Login', coworkerNoAccount:"Haven't registered? Sign up",
  managerLoginTitle:'Manager Login', managerLoginNote:'This section is for the site manager only.', phUsername:'Username', managerLoginBtn:'Enter Manager Dashboard',
  managerDashTitle:'Manager Dashboard', pendingAdmins:'Admin access requests', pendingCoworkers:'Partner requests', goToAdminLogin:'Go to Admin Panel Login',
  adminLoginTitle:'Admin Panel Login', adminLoginNote:'Access to this panel requires manager approval.', adminLoginBtn:'Login',
  adminPanelTitle:'Content Management Panel', adminPanelNote:'Edit the base gold price, partner discount, top bar text and product images.',
  adminGoldBase:'Price per gram, 18k (Toman)', adminDiscount:'Partner discount (%)', adminMarquee:'Top bar text', adminProductImg:'Upload image for product', adminSave:'Save changes',
  cartTitle:'Shopping Cart', cartEmpty:'Your cart is empty.', cartTotal:'Total:', cartCheckout:'Checkout',
  karat:'Karat', weight:'Weight', wage:'Making charge', category:'Category', addToCart:'Add to cart', coworkerPrice:'Partner price',
  pendingEmpty:'Nothing to review.', approve:'Approve', saved:'Changes saved successfully.',
  gram:'g', toman:'Toman', all:'All', added:'Added to cart', imgUploaded:'Image saved', readMore:'Read more →', purity:'Purity',
  trust1t:'Authenticity Guarantee', trust1s:'Purity certificate with every purchase', trust2t:'Fast Delivery', trust2s:'Secure, insured packaging', trust3t:'Guaranteed Buy-back', trust3s:'We buy your gold at the best rate', trust4t:'Secure Payment', trust4s:'Trusted, encrypted bank gateway',
  navTools:'Gold Tools', navVerify:'Verify',
  toolsEyebrow:'Smart Tools', toolsTitle:'Zomorod Gold Tools', toolsSub:'Live price, gold calculator and buy-back estimate — all in one place.',
  chartTitle:'Gold Price Trend', chartNote:'Per gram, 18k — last 7 days',
  calcTitle:'Gold Calculator', calcNote:'Enter weight and karat to see the approximate price.', calcWeight:'Weight (g)', calcKarat:'Karat', calcWage:'Making charge (%)', calcTotal:'Approx. price:',
  buybackTitle:'Buy-back Estimator', buybackNote:'How much is your gold worth today? (estimate)', buybackWeight:'Your gold weight (g)', buybackKarat:'Karat', buybackValue:'Buy-back value:', buybackFine:'* Final amount is set after in-person appraisal.',
  verifyEyebrow:'Guaranteed Authenticity', verifyTitle:'Verify Authenticity', verifyIntro:'Every Zomorod Gold piece has a unique serial number and a digital certificate of authenticity. Enter the serial from your invoice or the certificate QR to verify it.', verifyPh:'e.g. ZG-18-0007-XXXX', verifyBtn:'Verify', verifyHint:'To test: open any product and press "Certificate" to see its serial.',
  verifyOk:'✓ Authentic', verifyOkText:'This serial number belongs to a genuine Zomorod Gold product.', verifyFail:'✕ Not found', verifyFailText:'The entered serial number is not registered. Please check again.',
  badge1:'Gold & Jewelry Union', badge2:'E-Trust Symbol', badge3:'Secure Bank Gateway', badge4:'Intl. Purity Certificate',
  certBtn:'Certificate', certTitle:'Certificate of Authenticity', certSerial:'Serial Number', certIssued:'Issue Date', certAuthentic:'Authenticity Verified', certDesc:'This certificate confirms that the piece below, with the stated specifications, is a genuine Zomorod Gold product.', certVerify:'Verify Online', certCopy:'Copy serial', certCopied:'Copied',
  compareBtn:'Add to compare', compareTitle:'Compare Products', compareTray:'Compare:', compareOpen:'Compare', compareEmpty:'No products selected to compare.', compareFull:'You can compare up to 3 products.', compareAdded:'Added to compare', compareName:'Product', compareRemove:'Remove'
 },
 ar:{ dir:'rtl',
  loaderText:'جارٍ تجهيز كنزك...',
  marquee:'✨ زمرد جولد؛ نقاء وثقة وتألق في كل قيراط — توصيل سريع وضمان أصالة المنتج ✦ ضمان استرداد واستبدال ✦ استشارة مجانية لاختيار المجوهرات ✦ شهادة نقاء مع كل طلب ✨',
  navHome:'الرئيسية', navCategories:'الأقسام', navProducts:'المنتجات', navGallery:'المعرض', navAbout:'من نحن', navBlog:'مجلة الذهب', navSupport:'الدعم', navContact:'اتصل بنا',
  goldPriceLabel:'عيار ١٨',
  heroEyebrow:'تألق أصيل، ثقة دائمة', heroTitle1:'مجوهرات', heroTitle2:'تحكي', heroTitle3:'قصتك',
  heroDesc:'زمرد جولد؛ تشكيلة من أنقى الذهب والمجوهرات المصنوعة يدويًا، بأسعار شفافة ولحظية، وتوصيل حتى باب المنزل، وضمان أصالة المنتج مع شهادة نقاء.',
  heroBtn1:'تصفح المنتجات', heroBtn2:'استشارة مجانية',
  statYears:'سنوات خبرة', statClients:'عميل راضٍ', statGuarantee:'ضمان الأصالة',
  categoriesEyebrow:'المجموعات', categoriesTitle:'تسوق حسب القسم',
  productsEyebrow:'الواجهة', productsTitle:'منتجات زمرد جولد', productsSub:'يتم احتساب الأسعار تلقائيًا بناءً على سعر الذهب اللحظي وأجرة الصنع.',
  sortLabel:'ترتيب:', sortDefault:'افتراضي', sortPriceAsc:'الأرخص', sortPriceDesc:'الأغلى', sortWeight:'الأثقل',
  galleryEyebrow:'لحظات متألقة', galleryTitle:'معرض زمرد جولد',
  aboutBadge:'منذ ٢٠٠٦', aboutEyebrow:'قصة العلامة', aboutTitle:'إرث من النقاء والفن',
  aboutText1:'بدأت زمرد جولد من ورشة صياغة صغيرة في السوق القديم، حيث كانت كل قطعة تُصنع يدويًا وبحب. واليوم بعد أكثر من عقد، نقدم لك الأصالة ذاتها بتقنية حديثة وتسعير شفاف تمامًا.',
  aboutText2:'إيماننا بسيط: الذهب ليس مجرد معدن، بل ذاكرة اللحظات. لذلك نضع على كل قطعة شهادة نقاء وأصالة، مع ضمان إعادة الشراء.',
  guideEyebrow:'دليل الشراء', guideTitle:'كيف تختار الذهب المناسب؟',
  testiEyebrow:'ثقتكم', testiTitle:'آراء العملاء',
  blogEyebrow:'مجلة الذهب', blogTitle:'أحدث المقالات',
  supportEyebrow:'بجانبك', supportTitle:'الدعم',
  contactEyebrow:'تحدث إلينا', contactTitle:'اتصل بنا', contactIntro:'لديك سؤال أو تحتاج استشارة؟ املأ النموذج وسيتواصل معك خبراؤنا في أقرب وقت.',
  contactName:'الاسم الكامل', contactPhone:'رقم الهاتف', contactMsg:'رسالتك', contactSend:'إرسال الرسالة',
  contactAddrLabel:'العنوان:', contactAddr:'طهران، شارع الصاغة، ممر زمرد', contactEmailLabel:'البريد:', contactPhoneLabel:'الهاتف:',
  coworkerBtn:'دخول الشركاء', managerBtn:'دخول الإدارة',
  newsTitle:'كن على اطلاع بالعروض والمجموعات الجديدة', newsDesc:'أدخل بريدك لتكون أول من يعرف بالعروض الخاصة.', newsPh:'بريدك الإلكتروني', newsBtn:'اشتراك',
  footerAbout:'دار للذهب والمجوهرات الفاخرة، مع ضمان الأصالة وشهادة النقاء لكل طلب.', footerLinks:'روابط سريعة', footerHelp:'الدعم', footerFaq:'الأسئلة الشائعة', footerShipping:'الشحن والإرجاع', footerWarranty:'الضمان وإعادة الشراء', footerSocial:'تابعنا', footerText:'© جميع الحقوق محفوظة لزمرد جولد.',
  loginTab:'دخول', signupTab:'إنشاء حساب', phInputPhone:'رقم الجوال', phInputPass:'كلمة المرور', phInputFullname:'الاسم الكامل', loginBtn:'تسجيل الدخول', signupBtn:'إنشاء حساب',
  coworkerRegTitle:'نموذج تسجيل الشركاء', coworkerRegNote:'بعد إكمال النموذج، يُرسل طلبك إلى المدير، وبعد الموافقة يمكنك الدخول إلى لوحة الشراكة.',
  phFirstName:'الاسم الأول', phLastName:'اسم العائلة', phNationalCode:'الرقم الوطني', coworkerSubmit:'إرسال الطلب',
  coworkerPendingTitle:'تم تسجيل طلبك', coworkerPendingNote:'طلب الشراكة بانتظار موافقة المدير. بعد الموافقة يمكنك الدخول برقم الهاتف والرقم الوطني.',
  coworkerLoginTitle:'الدخول إلى لوحة الشراكة', coworkerLoginBtn:'دخول', coworkerNoAccount:'لم تسجل بعد؟ سجّل الآن',
  managerLoginTitle:'دخول الإدارة', managerLoginNote:'هذا القسم مخصص لمدير الموقع فقط.', phUsername:'اسم المستخدم', managerLoginBtn:'الدخول إلى لوحة الإدارة',
  managerDashTitle:'لوحة الإدارة', pendingAdmins:'طلبات دخول المشرفين', pendingCoworkers:'طلبات الشراكة', goToAdminLogin:'الذهاب إلى دخول لوحة المشرف',
  adminLoginTitle:'دخول لوحة المشرف', adminLoginNote:'الدخول إلى هذه اللوحة يتطلب موافقة المدير.', adminLoginBtn:'دخول',
  adminPanelTitle:'لوحة إدارة المحتوى', adminPanelNote:'تعديل سعر الذهب الأساسي، ونسبة خصم الشركاء، ونص الشريط العلوي، وصور المنتجات.',
  adminGoldBase:'سعر غرام عيار ١٨ (تومان)', adminDiscount:'نسبة خصم الشركاء (%)', adminMarquee:'نص الشريط العلوي', adminProductImg:'رفع صورة للمنتج', adminSave:'حفظ التغييرات',
  cartTitle:'سلة التسوق', cartEmpty:'سلتك فارغة.', cartTotal:'الإجمالي:', cartCheckout:'إتمام الشراء',
  karat:'العيار', weight:'الوزن', wage:'أجرة الصنع', category:'القسم', addToCart:'أضف إلى السلة', coworkerPrice:'سعر الشريك',
  pendingEmpty:'لا يوجد شيء للمراجعة.', approve:'موافقة', saved:'تم حفظ التغييرات بنجاح.',
  gram:'غ', toman:'تومان', all:'الكل', added:'أُضيف إلى السلة', imgUploaded:'تم حفظ الصورة', readMore:'اقرأ المزيد ←', purity:'النقاء',
  trust1t:'ضمان الأصالة', trust1s:'شهادة نقاء مع كل عملية شراء', trust2t:'توصيل سريع', trust2s:'تغليف آمن ومؤمَّن', trust3t:'إعادة شراء مضمونة', trust3s:'نشتري ذهبك بأفضل سعر', trust4t:'دفع آمن', trust4s:'بوابة بنكية موثوقة ومشفّرة',
  navTools:'أدوات الذهب', navVerify:'التحقق',
  toolsEyebrow:'أدوات ذكية', toolsTitle:'أدوات زمرد جولد', toolsSub:'السعر اللحظي، حاسبة الذهب وتقدير إعادة الشراء — في مكان واحد.',
  chartTitle:'اتجاه سعر الذهب', chartNote:'للغرام، عيار ١٨ — آخر ٧ أيام',
  calcTitle:'حاسبة الذهب', calcNote:'أدخل الوزن والعيار لرؤية السعر التقريبي.', calcWeight:'الوزن (غ)', calcKarat:'العيار', calcWage:'أجرة الصنع (%)', calcTotal:'السعر التقريبي:',
  buybackTitle:'حاسبة إعادة الشراء', buybackNote:'كم يساوي ذهبك اليوم؟ (تقديري)', buybackWeight:'وزن ذهبك (غ)', buybackKarat:'العيار', buybackValue:'قيمة إعادة الشراء:', buybackFine:'* يُحدَّد المبلغ النهائي بعد التقييم الحضوري.',
  verifyEyebrow:'أصالة مضمونة', verifyTitle:'التحقق من الأصالة', verifyIntro:'كل قطعة من زمرد جولد لها رقم تسلسلي فريد وشهادة أصالة رقمية. أدخل الرقم التسلسلي من الفاتورة أو رمز QR للتحقق منها.', verifyPh:'مثال: ZG-18-0007-XXXX', verifyBtn:'تحقق', verifyHint:'للتجربة: افتح أي منتج واضغط «الشهادة» لرؤية رقمه التسلسلي.',
  verifyOk:'✓ أصلي', verifyOkText:'هذا الرقم التسلسلي يخص منتجًا أصليًا من زمرد جولد.', verifyFail:'✕ غير موجود', verifyFailText:'الرقم التسلسلي المُدخل غير مسجّل. يرجى التحقق مجددًا.',
  badge1:'نقابة الذهب والمجوهرات', badge2:'رمز الثقة الإلكترونية', badge3:'بوابة بنكية آمنة', badge4:'شهادة نقاء دولية',
  certBtn:'الشهادة', certTitle:'شهادة الأصالة', certSerial:'الرقم التسلسلي', certIssued:'تاريخ الإصدار', certAuthentic:'تم التحقق من الأصالة', certDesc:'تؤكد هذه الشهادة أن القطعة أدناه، بالمواصفات المذكورة، منتج أصلي من زمرد جولد.', certVerify:'تحقق عبر الإنترنت', certCopy:'نسخ الرقم', certCopied:'تم النسخ',
  compareBtn:'أضف للمقارنة', compareTitle:'مقارنة المنتجات', compareTray:'مقارنة:', compareOpen:'قارن', compareEmpty:'لم يتم اختيار منتجات للمقارنة.', compareFull:'يمكنك مقارنة ٣ منتجات كحد أقصى.', compareAdded:'أُضيف للمقارنة', compareName:'المنتج', compareRemove:'حذف'
 }
};

/* ================= content data ================= */
const CATEGORY_ICONS = {
  ring:`<svg viewBox="0 0 64 64"><circle cx="32" cy="40" r="16"/><polygon points="32,8 42,20 32,28 22,20"/><path d="M22 20 L32 28 L42 20"/></svg>`,
  necklace:`<svg viewBox="0 0 64 64"><path d="M12 12 Q32 42 52 12" fill="none"/><circle cx="32" cy="48" r="7"/><path d="M32 34 L32 41"/></svg>`,
  bracelet:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="24" ry="13" fill="none"/><circle cx="32" cy="19" r="4"/></svg>`,
  earring:`<svg viewBox="0 0 64 64"><circle cx="32" cy="12" r="5"/><path d="M32 17 v12"/><circle cx="32" cy="42" r="13" fill="none"/></svg>`,
  coin:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="16" fill="none"/><path d="M32 22 v20 M22 32 h20"/></svg>`,
  bangle:`<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="21" fill="none" stroke-width="5"/><circle cx="32" cy="12" r="3"/></svg>`
};
const CATEGORY_NAMES = {
  ring:{fa:'انگشتر',en:'Ring',ar:'خاتم'}, necklace:{fa:'گردنبند',en:'Necklace',ar:'قلادة'},
  bracelet:{fa:'دستبند',en:'Bracelet',ar:'سوار'}, earring:{fa:'گوشواره',en:'Earrings',ar:'أقراط'},
  coin:{fa:'سکه',en:'Coin',ar:'عملة'}, bangle:{fa:'النگو',en:'Bangle',ar:'إسورة'}
};

/* per-product decorative SVG (gradient defined once in each) */
function productSVG(p){
  if(productImages[p.id]) return `<img src="${productImages[p.id]}" alt="">`;
  const g = `grad${p.id}`;
  return `<svg viewBox="0 0 200 200"><defs>
    <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F0D38A"/><stop offset="55%" stop-color="#C9A15A"/><stop offset="100%" stop-color="#A87C36"/>
    </linearGradient>
    <radialGradient id="${g}e"><stop offset="0%" stop-color="#3FB690"/><stop offset="100%" stop-color="#0d4433"/></radialGradient>
  </defs>${SHAPES[p.cat](g)}</svg>`;
}
const SHAPES = {
  ring:(g)=>`<circle cx="100" cy="118" r="46" fill="none" stroke="url(#${g})" stroke-width="12"/><polygon points="100,34 126,60 100,82 74,60" fill="url(#${g}e)" stroke="url(#${g})" stroke-width="3"/><path d="M74 60 L100 82 L126 60" fill="none" stroke="url(#${g})" stroke-width="2"/>`,
  necklace:(g)=>`<path d="M40 40 Q100 130 160 40" fill="none" stroke="url(#${g})" stroke-width="6"/><circle cx="100" cy="150" r="20" fill="url(#${g}e)" stroke="url(#${g})" stroke-width="4"/><path d="M100 118 L100 130" stroke="url(#${g})" stroke-width="4"/>`,
  bracelet:(g)=>`<ellipse cx="100" cy="100" rx="72" ry="40" fill="none" stroke="url(#${g})" stroke-width="11"/><circle cx="100" cy="60" r="12" fill="url(#${g}e)" stroke="url(#${g})" stroke-width="3"/>`,
  earring:(g)=>`<circle cx="100" cy="44" r="12" fill="url(#${g})"/><path d="M100 56 L100 84" stroke="url(#${g})" stroke-width="5"/><circle cx="100" cy="128" r="40" fill="none" stroke="url(#${g})" stroke-width="10"/><circle cx="100" cy="128" r="14" fill="url(#${g}e)"/>`,
  coin:(g)=>`<circle cx="100" cy="100" r="66" fill="url(#${g})"/><circle cx="100" cy="100" r="50" fill="none" stroke="#8a6626" stroke-width="3"/><polygon points="100,66 112,92 140,92 118,110 126,138 100,120 74,138 82,110 60,92 88,92" fill="#8a6626" opacity=".55"/>`,
  bangle:(g)=>`<circle cx="100" cy="100" r="64" fill="none" stroke="url(#${g})" stroke-width="16"/><circle cx="100" cy="100" r="64" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/><circle cx="100" cy="36" r="9" fill="url(#${g}e)"/>`
};

const PRODUCTS = [
  {id:1,cat:'ring',karat:18,weight:2.1,wage:22,name:{fa:'انگشتر سولیتر برگ',en:'Solitaire Leaf Ring',ar:'خاتم سوليتير ورقة'}},
  {id:2,cat:'ring',karat:21,weight:3.4,wage:18,name:{fa:'انگشتر ژوپیتر',en:'Jupiter Ring',ar:'خاتم جوبيتر'}},
  {id:3,cat:'ring',karat:18,weight:1.8,wage:26,name:{fa:'انگشتر نگین مروارید',en:'Pearl Accent Ring',ar:'خاتم مرصع باللؤلؤ'}},
  {id:4,cat:'ring',karat:24,weight:4.2,wage:12,name:{fa:'انگشتر آبشده کلاسیک',en:'Classic Molten Ring',ar:'خاتم مسبوك كلاسيكي'}},
  {id:5,cat:'necklace',karat:18,weight:5.6,wage:20,name:{fa:'گردنبند برگ زمرد',en:'Emerald Leaf Necklace',ar:'قلادة ورقة الزمرد'}},
  {id:6,cat:'necklace',karat:21,weight:8.3,wage:16,name:{fa:'گردنبند ونیزی',en:'Venetian Chain Necklace',ar:'قلادة البندقية'}},
  {id:7,cat:'necklace',karat:18,weight:6.1,wage:24,name:{fa:'گردنبند قلب دوقلو',en:'Twin Heart Necklace',ar:'قلادة القلب المزدوج'}},
  {id:8,cat:'necklace',karat:24,weight:9.5,wage:10,name:{fa:'گردنبند سکه‌ای',en:'Coin Style Necklace',ar:'قلادة على شكل عملة'}},
  {id:9,cat:'bracelet',karat:18,weight:4.4,wage:19,name:{fa:'دستبند رولو',en:'Rolo Chain Bracelet',ar:'سوار رولو'}},
  {id:10,cat:'bracelet',karat:21,weight:6.7,wage:15,name:{fa:'دستبند کارتیه',en:'Cartier Style Bracelet',ar:'سوار كارتييه'}},
  {id:11,cat:'bracelet',karat:18,weight:3.9,wage:23,name:{fa:'دستبند پروانه',en:'Butterfly Bracelet',ar:'سوار الفراشة'}},
  {id:12,cat:'earring',karat:18,weight:1.5,wage:27,name:{fa:'گوشواره حلقه مینیمال',en:'Minimal Hoop Earrings',ar:'أقراط دائرية بسيطة'}},
  {id:13,cat:'earring',karat:21,weight:2.2,wage:20,name:{fa:'گوشواره آویز قطره',en:'Teardrop Earrings',ar:'أقراط على شكل قطرة'}},
  {id:14,cat:'earring',karat:18,weight:1.9,wage:25,name:{fa:'گوشواره ستاره',en:'Star Stud Earrings',ar:'أقراط نجمة'}},
  {id:15,cat:'coin',karat:24,weight:8.13,wage:6,name:{fa:'سکه تمام بهار آزادی',en:'Full Bahar Azadi Coin',ar:'عملة بهار آزادي كاملة'}},
  {id:16,cat:'coin',karat:24,weight:4.06,wage:6,name:{fa:'سکه نیم بهار آزادی',en:'Half Bahar Azadi Coin',ar:'نصف عملة بهار آزادي'}},
  {id:17,cat:'bangle',karat:18,weight:12.4,wage:14,name:{fa:'النگو ساده کلاسیک',en:'Classic Plain Bangle',ar:'إسورة كلاسيكية'}},
  {id:18,cat:'bangle',karat:21,weight:15.1,wage:11,name:{fa:'النگو گیسویی',en:'Twisted Rope Bangle',ar:'إسورة مجدولة'}},
  {id:19,cat:'ring',karat:21,weight:2.9,wage:21,name:{fa:'انگشتر مردانه پرچمدار',en:"Men's Signet Ring",ar:'خاتم رجالي بختم'}},
  {id:20,cat:'necklace',karat:18,weight:7.0,wage:18,name:{fa:'گردنبند خوشه ستاره',en:'Star Cluster Necklace',ar:'قلادة عنقود النجوم'}},
  {id:21,cat:'earring',karat:18,weight:2.6,wage:22,name:{fa:'گوشواره شاندلیر',en:'Chandelier Earrings',ar:'أقراط الثريا'}},
  {id:22,cat:'bracelet',karat:24,weight:9.8,wage:9,name:{fa:'دستبند حصیری',en:'Woven Gold Bracelet',ar:'سوار مجدول ذهبي'}}
];

/* ---- unique serial number per product (deterministic, demo only) ---- */
/* TODO backend: serials must be issued & stored server-side per physical item */
function serialFor(p){
  // ZG-<karat>-<id padded>-<deterministic 4-char hash>
  const seed=(p.id*7919 + p.karat*31 + Math.round(p.weight*100))>>>0;
  const hash=seed.toString(36).toUpperCase().padStart(4,'0').slice(-4);
  return `ZG-${p.karat}-${String(p.id).padStart(4,'0')}-${hash}`;
}
const SERIAL_INDEX={}; PRODUCTS.forEach(p=> SERIAL_INDEX[serialFor(p)]=p);

/* ---- deterministic 7-day gold price history (demo only) ---- */
/* TODO backend: replace with real historical series from /api/gold-history */
function priceHistory(){
  const days=7, out=[]; let v=goldPricePerGram;
  // walk backwards with small pseudo-random but stable steps
  for(let i=0;i<days;i++){ const wobble=Math.sin(i*1.7)*0.011 + (i%2?-0.004:0.006); out.unshift(v); v=v/(1+wobble); }
  return out;
}
const DAY_LABELS={
  fa:['۶ روز','۵ روز','۴ روز','۳ روز','۲ روز','دیروز','امروز'],
  en:['6d','5d','4d','3d','2d','Yest.','Today'],
  ar:['٦ أيام','٥ أيام','٤ أيام','٣ أيام','يومان','أمس','اليوم']
};

const BLOG_POSTS = [
  {tag:{fa:'راهنما',en:'Guide',ar:'دليل'}, date:{fa:'۱۴ مرداد ۱۴۰۴',en:'Aug 5, 2025',ar:'٥ أغسطس'}, title:{fa:'تفاوت عیار ۱۸، ۲۱ و ۲۴ در چیست؟',en:'What is the difference between 18k, 21k and 24k?',ar:'ما الفرق بين عيار ١٨ و ٢١ و ٢٤؟'}, ex:{fa:'هرچه عیار بالاتر باشد، طلا خالص‌تر اما نرم‌تر است. در این مقاله بهترین انتخاب برای هر کاربرد را بررسی می‌کنیم.',en:'The higher the karat, the purer but softer the gold. Here we review the best choice for each use.',ar:'كلما ارتفع العيار، كان الذهب أنقى لكنه أكثر ليونة. نستعرض هنا أفضل خيار لكل استخدام.'}},
  {tag:{fa:'نگهداری',en:'Care',ar:'عناية'}, date:{fa:'۷ مرداد ۱۴۰۴',en:'Jul 29, 2025',ar:'٢٩ يوليو'}, title:{fa:'۵ راز نگهداری طلا برای درخشش همیشگی',en:'5 secrets to keep your gold shining forever',ar:'٥ أسرار للحفاظ على بريق ذهبك'}, ex:{fa:'از تماس با عطر و مواد شوینده تا نحوه‌ی صحیح نگهداری؛ نکاتی که عمر جواهر شما را چند برابر می‌کند.',en:'From avoiding perfume and detergents to proper storage; tips that multiply the life of your jewelry.',ar:'من تجنّب العطور والمنظفات إلى التخزين الصحيح؛ نصائح تُطيل عمر مجوهراتك.'}},
  {tag:{fa:'سرمایه‌گذاری',en:'Investment',ar:'استثمار'}, date:{fa:'۱ مرداد ۱۴۰۴',en:'Jul 23, 2025',ar:'٢٣ يوليو'}, title:{fa:'سکه بخریم یا طلای آبشده؟',en:'Coins or bullion gold — which to buy?',ar:'نشتري العملات أم السبائك؟'}, ex:{fa:'برای حفظ ارزش پول، کدام گزینه اجرت کمتر و نقدشوندگی بالاتری دارد؟ مقایسه‌ای کامل و کاربردی.',en:'To preserve value, which option has lower charges and higher liquidity? A complete, practical comparison.',ar:'للحفاظ على القيمة، أي خيار له أجرة أقل وسيولة أعلى؟ مقارنة عملية شاملة.'}}
];
const TESTIMONIALS = [
  {name:{fa:'سارا محمدی',en:'Sara M.',ar:'سارة م.'}, role:{fa:'مشتری وفادار',en:'Loyal customer',ar:'عميلة وفية'}, text:{fa:'کیفیت و بسته‌بندی فوق‌العاده بود. گواهی اصالت واقعاً خیال آدم را راحت می‌کند.',en:'The quality and packaging were superb. The authenticity certificate really gives peace of mind.',ar:'الجودة والتغليف رائعان. شهادة الأصالة تمنح راحة البال حقًا.'}, i:'س'},
  {name:{fa:'علی رضایی',en:'Ali R.',ar:'علي ر.'}, role:{fa:'خرید اول',en:'First purchase',ar:'أول عملية شراء'}, text:{fa:'قیمت لحظه‌ای و شفاف بودن اجرت باعث شد با اطمینان کامل خرید کنم. پشتیبانی هم عالی بود.',en:'Live pricing and transparent charges let me buy with full confidence. Support was excellent too.',ar:'الأسعار اللحظية والشفافية جعلتني أشتري بثقة تامة. الدعم كان ممتازًا أيضًا.'}, i:'ع'},
  {name:{fa:'نگار احمدی',en:'Negar A.',ar:'نغار أ.'}, role:{fa:'هدیه سالگرد',en:'Anniversary gift',ar:'هدية ذكرى'}, text:{fa:'گردنبند را برای سالگرد سفارش دادم و به‌موقع رسید. طراحی‌اش دقیقاً مثل عکس سایت بود.',en:'I ordered the necklace for our anniversary and it arrived on time. The design was exactly like the site photo.',ar:'طلبت القلادة لذكرى زواجنا ووصلت في الوقت. التصميم مطابق تمامًا لصورة الموقع.'}, i:'ن'}
];
const GUIDE_STEPS = [
  {t:{fa:'عیار را بشناسید',en:'Know the karat',ar:'اعرف العيار'}, d:{fa:'۱۸ عیار برای استفاده روزمره، ۲۴ عیار برای سرمایه‌گذاری مناسب‌تر است.',en:'18k suits daily wear, 24k is better for investment.',ar:'عيار ١٨ للاستخدام اليومي، وعيار ٢٤ أنسب للاستثمار.'}},
  {t:{fa:'اجرت را مقایسه کنید',en:'Compare making charge',ar:'قارن أجرة الصنع'}, d:{fa:'اجرت بخش مهمی از قیمت است؛ طرح‌های ساده‌تر اجرت کمتری دارند.',en:'Making charge is a big part of price; simpler designs cost less.',ar:'أجرة الصنع جزء مهم من السعر؛ التصاميم الأبسط أقل تكلفة.'}},
  {t:{fa:'گواهی اصالت بخواهید',en:'Ask for a certificate',ar:'اطلب شهادة'}, d:{fa:'هر خرید معتبر باید همراه گواهی خلوص و فاکتور رسمی باشد.',en:'Every valid purchase should include a purity certificate and official invoice.',ar:'كل عملية شراء موثوقة يجب أن تتضمن شهادة نقاء وفاتورة رسمية.'}},
  {t:{fa:'بازخرید را بسنجید',en:'Check buy-back',ar:'تحقق من إعادة الشراء'}, d:{fa:'فروشگاه معتبر تضمین بازخرید با کمترین کسر ارائه می‌دهد.',en:'A trusted store offers buy-back with the lowest deduction.',ar:'المتجر الموثوق يقدّم إعادة شراء بأقل خصم.'}}
];
const TRUST_ITEMS = [
  {icon:`<svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>`, t:'trust1t', s:'trust1s'},
  {icon:`<svg viewBox="0 0 24 24"><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/></svg>`, t:'trust2t', s:'trust2s'},
  {icon:`<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 1 8 8"/><path d="M4 12v5m0-5h5"/><path d="M12 8v4l3 2"/></svg>`, t:'trust3t', s:'trust3s'},
  {icon:`<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`, t:'trust4t', s:'trust4s'}
];
const SUPPORT_CARDS = [
  {icon:'☎', tKey:'sc1t', dKey:'sc1d', valKey:'sc1v'},
  {icon:'✦', tKey:'sc2t', dKey:'sc2d', btnKey:'sc2b'},
  {icon:'?', tKey:'sc3t', dKey:'sc3d', linkKey:'sc3l'}
];
const SUPPORT_TEXT = {
  fa:{sc1t:'تماس تلفنی',sc1d:'پشتیبانان ما هر روز از ساعت ۹ تا ۲۱ پاسخگوی شما هستند.',sc1v:'021-9100-XXXX',sc2t:'چت آنلاین',sc2d:'در کمتر از چند دقیقه با کارشناسان ما گفتگو کنید.',sc2b:'شروع گفتگو',sc3t:'سوالات متداول',sc3d:'پاسخ سوالات رایج درباره خرید، ارسال و گارانتی.',sc3l:'مشاهده →'},
  en:{sc1t:'Phone Support',sc1d:'Our team is available every day from 9am to 9pm.',sc1v:'021-9100-XXXX',sc2t:'Live Chat',sc2d:'Chat with our specialists in a few minutes.',sc2b:'Start Chat',sc3t:'FAQ',sc3d:'Answers to common questions about orders, shipping and warranty.',sc3l:'View →'},
  ar:{sc1t:'الدعم الهاتفي',sc1d:'فريقنا متاح يوميًا من ٩ صباحًا حتى ٩ مساءً.',sc1v:'021-9100-XXXX',sc2t:'محادثة مباشرة',sc2d:'تحدث مع خبرائنا خلال دقائق.',sc2b:'بدء المحادثة',sc3t:'الأسئلة الشائعة',sc3d:'إجابات عن الأسئلة الشائعة حول الشراء والشحن والضمان.',sc3l:'عرض ←'}
};
const ABOUT_FEATS = {
  fa:[['◈','گواهی خلوص','همراه هر سفارش'],['✦','اجرت شفاف','بدون هزینه پنهان'],['◇','بازخرید تضمینی','با کمترین کسر'],['❖','ارسال بیمه‌شده','به سراسر کشور']],
  en:[['◈','Purity certificate','with every order'],['✦','Transparent charge','no hidden fees'],['◇','Guaranteed buy-back','lowest deduction'],['❖','Insured shipping','nationwide']],
  ar:[['◈','شهادة نقاء','مع كل طلب'],['✦','أجرة شفافة','بلا رسوم خفية'],['◇','إعادة شراء مضمونة','بأقل خصم'],['❖','شحن مؤمَّن','لكل البلاد']]
};
const GALLERY = ['ring','necklace','earring','bangle','coin','bracelet','ring','necklace'];

/* ================= helpers ================= */
function fmt(n){ const loc = currentLang==='en'?'en-US':currentLang==='ar'?'ar-EG':'fa-IR'; return Math.round(n).toLocaleString(loc); }
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2200); }
function saveLS(){ localStorage.setItem('zg_cart',JSON.stringify(cart)); localStorage.setItem('zg_favs',JSON.stringify(favs)); }

/* ================= i18n apply ================= */
function applyI18n(){
  const d=I18N[currentLang];
  document.documentElement.lang=currentLang; document.documentElement.dir=d.dir;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(d[k]!=null) el.textContent=d[k]; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ const k=el.getAttribute('data-i18n-ph'); if(d[k]!=null) el.setAttribute('placeholder',d[k]); });
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===currentLang));
  renderTrust(); renderCategories(); renderFilters(); renderProducts(); renderGallery();
  renderAboutFeats(); renderGuide(); renderTesti(); renderBlog(); renderSupport();
  renderTrustBadges(); renderPriceChart(); bindCalculators(); renderVerifyForm(); renderCompareTray();
  document.getElementById('goldPriceValue').textContent=fmt(goldPricePerGram);
  applyMarqueeOverride();
}
document.querySelectorAll('.lang-btn').forEach(b=> b.addEventListener('click',()=>{ currentLang=b.dataset.lang; localStorage.setItem('zg_lang',currentLang); applyI18n(); }));

/* ================= theme ================= */
function applyTheme(t){ document.documentElement.setAttribute('data-theme',t); localStorage.setItem('zg_theme',t); particleTheme=t; }
applyTheme(particleTheme);
document.getElementById('themeToggle').addEventListener('click',()=> applyTheme(particleTheme==='dark'?'light':'dark'));

/* ================= loader (min 2s) ================= */
window.addEventListener('load',()=> setTimeout(()=> document.getElementById('loader').classList.add('done'),2000));

/* ================= mobile nav ================= */
const burger=document.getElementById('burgerBtn'), navLinks=document.getElementById('navLinks');
burger.addEventListener('click',()=> navLinks.classList.toggle('open'));
navLinks.querySelectorAll('.nav-link').forEach(l=> l.addEventListener('click',()=>{ navLinks.classList.remove('open'); navLinks.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active')); l.classList.add('active'); }));

/* ================= particles ================= */
const canvas=document.getElementById('particles'), pctx=canvas.getContext('2d');
let W,H,particles=[],sparks=[]; const mouse={x:-9999,y:-9999};
function resizeCanvas(){ W=canvas.width=innerWidth; H=canvas.height=document.documentElement.scrollHeight; }
function initParticles(){
  particles=[]; const c=Math.min(110,Math.floor((W*H)/20000));
  for(let i=0;i<c;i++){
    // ~30% of particles are "followers" that drift toward the cursor
    const follower=Math.random()<0.3;
    particles.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*2+.6,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
      hue:Math.random()>.76?'em':'gd', follower });
  }
}
resizeCanvas(); initParticles();
window.addEventListener('resize',()=>{ resizeCanvas(); initParticles(); });
window.addEventListener('mousemove',e=>{ mouse.x=e.clientX; mouse.y=e.clientY+window.scrollY; });
window.addEventListener('mouseleave',()=>{ mouse.x=-9999; mouse.y=-9999; });

/* golden burst on click — scatters sparks from the clicked point */
function burst(cx,cy){
  const n=18+Math.floor(Math.random()*8);
  for(let i=0;i<n;i++){
    const ang=(Math.PI*2*i)/n + Math.random()*0.5;
    const sp=2+Math.random()*4.5;
    sparks.push({ x:cx, y:cy, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp,
      r:Math.random()*2.2+1, life:1, hue:Math.random()>.7?'em':'gd' });
  }
}
window.addEventListener('click',e=>{
  // ignore clicks on inputs/close buttons so it feels intentional, not noisy
  if(e.target.closest('input,textarea,select,.modal-close')) return;
  burst(e.clientX, e.clientY+window.scrollY);
});

function drawParticles(){
  pctx.clearRect(0,0,W,H);
  const a=particleTheme==='dark'?'0.85)':'0.5)';
  for(const p of particles){
    const dx=p.x-mouse.x, dy=p.y-mouse.y, dist=Math.hypot(dx,dy);
    if(p.follower && dist<240 && dist>2){
      // gently pulled toward the cursor, trailing behind it
      const f=(240-dist)/240; p.x-=(dx/dist)*f*1.9; p.y-=(dy/dist)*f*1.9;
    } else if(dist<130){
      // non-followers are repelled (original behaviour)
      const f=(130-dist)/130; p.x+=(dx/dist||0)*f*1.7; p.y+=(dy/dist||0)*f*1.7;
    }
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    pctx.beginPath();
    pctx.fillStyle=(p.hue==='gd'?'rgba(201,161,90,':'rgba(63,182,144,')+a;
    pctx.arc(p.x,p.y,p.r,0,Math.PI*2); pctx.fill();
  }
  // draw + update click sparks
  for(let i=sparks.length-1;i>=0;i--){
    const s=sparks[i];
    s.x+=s.vx; s.y+=s.vy; s.vy+=0.04; s.vx*=0.97; s.vy*=0.97; s.life-=0.022;
    if(s.life<=0){ sparks.splice(i,1); continue; }
    pctx.beginPath();
    pctx.fillStyle=(s.hue==='gd'?'rgba(240,211,138,':'rgba(63,182,144,')+s.life.toFixed(2)+')';
    pctx.arc(s.x,s.y,s.r*s.life,0,Math.PI*2); pctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();
setInterval(()=>{ const nh=document.documentElement.scrollHeight; if(Math.abs(nh-H)>60){ H=canvas.height=nh; } },1500);

/* ================= gold price ticker ================= */
/* TODO backend: replace with fetch('/api/gold-price') polling */
let lastGold=goldPricePerGram;
function tickGold(){
  const drift=goldPricePerGram*(Math.random()*0.006-0.003);
  goldPricePerGram=Math.max(1000000,goldPricePerGram+drift);
  document.getElementById('goldPriceValue').textContent=fmt(goldPricePerGram);
  const tr=document.getElementById('goldTrend');
  if(goldPricePerGram>lastGold){ tr.textContent='▲'; tr.className='chip-trend up'; }
  else{ tr.textContent='▼'; tr.className='chip-trend down'; }
  lastGold=goldPricePerGram;
  renderProducts();
  const cn=document.getElementById('chartPriceNow'); if(cn) cn.textContent=fmt(goldPricePerGram);
  if(typeof bindCalculators==='function') bindCalculators();
}
tickGold(); setInterval(tickGold,5000);

/* ================= marquee override ================= */
function applyMarqueeOverride(){ const o=localStorage.getItem('zg_marquee_'+currentLang); if(o) document.querySelectorAll('#marqueeTrack span').forEach(s=> s.textContent=o); }

/* ================= price calc ================= */
function calcPrice(p){
  const base=goldPricePerGram*p.weight*(p.karat/18);
  const wage=base*(p.wage/100);
  let total=(base+wage)*1.07;
  if(CURRENT_COWORKER){ const disc=Number(localStorage.getItem('zg_coworker_discount'))||5; total*=(1-disc/100); return {total, old:(base+wage)*1.07}; }
  return {total, old:null};
}

/* ================= renderers ================= */
function renderTrust(){
  const d=I18N[currentLang];
  document.getElementById('trustBar').innerHTML=TRUST_ITEMS.map(it=>`
    <div class="trust-item"><div class="trust-icon">${it.icon}</div><div><b>${d[it.t]}</b><span>${d[it.s]}</span></div></div>`).join('');
}
function renderCategories(){
  const grid=document.getElementById('catGrid'); grid.innerHTML='';
  Object.keys(CATEGORY_ICONS).forEach(k=>{
    const count=PRODUCTS.filter(p=>p.cat===k).length;
    const el=document.createElement('div'); el.className='cat-card';
    el.innerHTML=CATEGORY_ICONS[k]+`<span>${CATEGORY_NAMES[k][currentLang]}</span><span class="cat-count">${count} ${I18N[currentLang].all==='All'?'items':'مورد'}</span>`;
    el.addEventListener('click',()=>{ activeCategory=k; document.getElementById('products').scrollIntoView({behavior:'smooth'}); renderFilters(); renderProducts(); });
    grid.appendChild(el);
  });
}
function renderFilters(){
  const d=I18N[currentLang]; const bar=document.getElementById('filterBar'); bar.innerHTML='';
  const mk=(key,label)=>{ const b=document.createElement('button'); b.className='filter-chip'+(activeCategory===key?' active':''); b.textContent=label; b.addEventListener('click',()=>{ activeCategory=key; renderFilters(); renderProducts(); }); bar.appendChild(b); };
  mk('all',d.all);
  Object.keys(CATEGORY_ICONS).forEach(k=> mk(k,CATEGORY_NAMES[k][currentLang]));
}
function sortList(list){
  const c=[...list];
  if(currentSort==='priceAsc') c.sort((a,b)=>calcPrice(a).total-calcPrice(b).total);
  else if(currentSort==='priceDesc') c.sort((a,b)=>calcPrice(b).total-calcPrice(a).total);
  else if(currentSort==='weightDesc') c.sort((a,b)=>b.weight-a.weight);
  return c;
}
function renderProducts(){
  const d=I18N[currentLang]; const grid=document.getElementById('productGrid'); if(!grid) return;
  const list=sortList(PRODUCTS.filter(p=>activeCategory==='all'||p.cat===activeCategory));
  grid.innerHTML='';
  list.forEach((p,i)=>{
    const pr=calcPrice(p);
    const card=document.createElement('div'); card.className='product-card';
    card.style.transitionDelay=(i%8*40)+'ms';
    card.innerHTML=`
      <div class="product-thumb">
        <span class="karat-badge">${p.karat} ${d.karat}</span>
        <button class="fav-btn ${favs.includes(p.id)?'on':''}" data-fav="${p.id}">${favs.includes(p.id)?'♥':'♡'}</button>
        ${productSVG(p)}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name[currentLang]}</div>
        <div class="product-meta">${d.weight}: ${p.weight} ${d.gram} · ${d.wage}: ${p.wage}%</div>
        <div class="product-price">
          <span>${fmt(pr.total)} ${d.toman}${pr.old?` <span class="old-price">${fmt(pr.old)}</span>`:''}</span>
          ${CURRENT_COWORKER?`<span class="coworker-tag">${d.coworkerPrice}</span>`:''}
        </div>
      </div>`;
    card.addEventListener('click',e=>{ if(e.target.closest('[data-fav]')) return; openProductModal(p); });
    card.querySelector('[data-fav]').addEventListener('click',ev=>{ ev.stopPropagation(); toggleFav(p.id); });
    grid.appendChild(card);
    requestAnimationFrame(()=> requestAnimationFrame(()=> card.classList.add('in')));
  });
}
function toggleFav(id){ const i=favs.indexOf(id); if(i>-1) favs.splice(i,1); else favs.push(id); saveLS(); renderProducts(); }

function openProductModal(p){
  const d=I18N[currentLang]; const pr=calcPrice(p);
  const purity=p.karat===24?'99.9%':p.karat===21?'87.5%':'75%';
  document.getElementById('productModalBody').innerHTML=`
    <div class="pm-grid">
      <div class="pm-thumb">${productSVG(p)}</div>
      <div>
        <div class="pm-name">${p.name[currentLang]}</div>
        <div class="pm-cat">${CATEGORY_NAMES[p.cat][currentLang]}</div>
        <ul class="pm-specs">
          <li><span>${d.karat}</span><b>${p.karat}</b></li>
          <li><span>${d.purity}</span><b>${purity}</b></li>
          <li><span>${d.weight}</span><b>${p.weight} ${d.gram}</b></li>
          <li><span>${d.wage}</span><b>${p.wage}%</b></li>
        </ul>
        <div class="pm-price">${fmt(pr.total)} ${d.toman}${pr.old?`<small>${fmt(pr.old)}</small>`:''}</div>
        <div class="pm-serial"><span>${d.certSerial}:</span> <code dir="ltr">${serialFor(p)}</code></div>
        <button class="btn btn-gold btn-block" id="pmAdd">${d.addToCart}</button>
        <div class="pm-actions">
          <button class="btn btn-ghost pm-half" id="pmCert">◈ ${d.certBtn}</button>
          <button class="btn btn-ghost pm-half" id="pmCompare">⇄ ${d.compareBtn}</button>
        </div>
      </div>
    </div>`;
  document.getElementById('pmAdd').addEventListener('click',()=>{ addToCart(p); });
  document.getElementById('pmCert').addEventListener('click',()=>{ closeModal('productModal'); openCertModal(p); });
  document.getElementById('pmCompare').addEventListener('click',()=>{ addToCompare(p); });
  openModal('productModal');
}

function renderGallery(){
  const grid=document.getElementById('galleryGrid'); grid.innerHTML='';
  GALLERY.forEach((cat,i)=>{
    const el=document.createElement('div');
    el.className='gallery-item'+(i===0?' tall':'')+(i===3?' wide':'');
    el.setAttribute('data-label',CATEGORY_NAMES[cat][currentLang]);
    el.innerHTML=productSVG({id:'g'+i,cat});
    grid.appendChild(el);
  });
}
function renderAboutFeats(){
  document.getElementById('aboutFeatures').innerHTML=ABOUT_FEATS[currentLang].map(f=>`
    <div class="about-feat"><div class="fi">${f[0]}</div><div><b>${f[1]}</b><span>${f[2]}</span></div></div>`).join('');
}
function renderGuide(){
  document.getElementById('guideGrid').innerHTML=GUIDE_STEPS.map((g,i)=>`
    <div class="guide-card"><div class="guide-num">0${i+1}</div><h4>${g.t[currentLang]}</h4><p>${g.d[currentLang]}</p></div>`).join('');
}
function renderTesti(){
  document.getElementById('testiGrid').innerHTML=TESTIMONIALS.map(t=>`
    <div class="testi-card"><div class="testi-quote">”</div><div class="testi-stars">★★★★★</div>
    <p class="testi-text">${t.text[currentLang]}</p>
    <div class="testi-author"><div class="testi-avatar">${t.i}</div><div><b>${t.name[currentLang]}</b><span>${t.role[currentLang]}</span></div></div></div>`).join('');
}
function renderBlog(){
  const d=I18N[currentLang];
  document.getElementById('blogGrid').innerHTML=BLOG_POSTS.map(b=>`
    <div class="blog-card"><div class="blog-thumb"><span class="blog-tag">${b.tag[currentLang]}</span>${productSVG({id:'b'+b.title.en,cat:'coin'})}</div>
    <div class="blog-body"><span class="blog-date">${b.date[currentLang]}</span><h4>${b.title[currentLang]}</h4><p>${b.ex[currentLang]}</p><span class="blog-read">${d.readMore}</span></div></div>`).join('');
}
function renderSupport(){
  const st=SUPPORT_TEXT[currentLang];
  document.getElementById('supportGrid').innerHTML=`
    <div class="support-card"><div class="si">☎</div><h3>${st.sc1t}</h3><p>${st.sc1d}</p><span class="support-value" dir="ltr">${st.sc1v}</span></div>
    <div class="support-card"><div class="si">✦</div><h3>${st.sc2t}</h3><p>${st.sc2d}</p><button class="btn-outline">${st.sc2b}</button></div>
    <div class="support-card"><div class="si">?</div><h3>${st.sc3t}</h3><p>${st.sc3d}</p><a href="#contact" class="link-arrow">${st.sc3l}</a></div>`;
}

/* ================= GROUP 1: authenticity ================= */
const BADGE_ICONS=[
  `<svg viewBox="0 0 24 24"><path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>`,
  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/></svg>`,
  `<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 2l2.4 5 5.6.6-4 4 1 5.4L12 19l-5 3 1-5.4-4-4 5.6-.6z"/></svg>`
];
function renderTrustBadges(){
  const d=I18N[currentLang]; const g=document.getElementById('trustBadges'); if(!g) return;
  g.innerHTML=[1,2,3,4].map((n,i)=>`
    <div class="trust-badge"><div class="tb-icon">${BADGE_ICONS[i]}</div><span>${d['badge'+n]}</span></div>`).join('');
}

/* certificate modal */
function openCertModal(p){
  const d=I18N[currentLang]; const serial=serialFor(p);
  const purity=p.karat===24?'99.9%':p.karat===21?'87.5%':'75%';
  const issued=new Date().toLocaleDateString(currentLang==='en'?'en-US':currentLang==='ar'?'ar-EG':'fa-IR');
  document.getElementById('certBody').innerHTML=`
    <div class="cert-sheet">
      <div class="cert-top">
        <div class="cert-emblem">
          <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><path d="M22 9 L33 19 L29 34 L15 34 L11 19 Z"/></svg>
        </div>
        <div>
          <div class="cert-brand">زمرد <em>گلد</em></div>
          <div class="cert-sub">${d.certTitle}</div>
        </div>
        <div class="cert-seal">${d.certAuthentic}</div>
      </div>
      <p class="cert-desc">${d.certDesc}</p>
      <div class="cert-main">
        <div class="cert-thumb">${productSVG(p)}</div>
        <ul class="cert-specs">
          <li><span>${d.compareName}</span><b>${p.name[currentLang]}</b></li>
          <li><span>${d.karat}</span><b>${p.karat} (${purity})</b></li>
          <li><span>${d.weight}</span><b>${p.weight} ${d.gram}</b></li>
          <li><span>${d.certIssued}</span><b>${issued}</b></li>
        </ul>
      </div>
      <div class="cert-bottom">
        <div class="cert-qr" id="certQr" title="${serial}"></div>
        <div class="cert-serial-box">
          <span>${d.certSerial}</span>
          <code dir="ltr" id="certSerialText">${serial}</code>
          <button class="btn-outline cert-copy" id="certCopyBtn">${d.certCopy}</button>
        </div>
      </div>
    </div>`;
  drawQR(document.getElementById('certQr'), serial);
  document.getElementById('certCopyBtn').addEventListener('click',()=>{
    navigator.clipboard?.writeText(serial).then(()=>toast(d.certCopied)).catch(()=>toast(d.certCopied));
  });
  openModal('certModal');
}

/* tiny deterministic QR-like matrix (decorative, not a real scannable QR) */
function drawQR(container, text){
  const N=21; let h=0; for(let i=0;i<text.length;i++) h=(h*31+text.charCodeAt(i))>>>0;
  let rnd=h; const rand=()=>{ rnd=(rnd*1103515245+12345)&0x7fffffff; return rnd/0x7fffffff; };
  let cells='';
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const finder=(x<7&&y<7)||(x>=N-7&&y<7)||(x<7&&y>=N-7);
    let on;
    if(finder){ const lx=x>=N-7?x-(N-7):x, ly=y>=N-7?y-(N-7):y; on=(lx===0||lx===6||ly===0||ly===6||(lx>=2&&lx<=4&&ly>=2&&ly<=4)); }
    else on=rand()>0.5;
    if(on) cells+=`<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  container.innerHTML=`<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges">${cells}</svg>`;
}

/* authenticity verify */
function renderVerifyForm(){
  const form=document.getElementById('verifyForm'); if(!form||form._bound) return; form._bound=true;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    /* TODO backend: GET /api/verify?serial= — validate server-side */
    const d=I18N[currentLang];
    const val=document.getElementById('verifyInput').value.trim().toUpperCase();
    const p=SERIAL_INDEX[val];
    const box=document.getElementById('verifyResult');
    if(p){
      box.className='verify-result ok';
      box.innerHTML=`<b>${d.verifyOk}</b><p>${d.verifyOkText}</p>
        <div class="vr-item">${p.name[currentLang]} — ${p.karat} ${d.karat} · ${p.weight} ${d.gram}</div>
        <button class="btn-outline" id="vrCert">◈ ${d.certBtn}</button>`;
      document.getElementById('vrCert').addEventListener('click',()=> openCertModal(p));
    } else {
      box.className='verify-result fail';
      box.innerHTML=`<b>${d.verifyFail}</b><p>${d.verifyFailText}</p>`;
    }
  });
}

/* ================= GROUP 2: tools ================= */
function renderPriceChart(){
  const svg=document.getElementById('priceChart'); if(!svg) return;
  const d=I18N[currentLang]; const data=priceHistory();
  const w=520,h=200,pad=14;
  const min=Math.min(...data), max=Math.max(...data), range=(max-min)||1;
  const x=i=> pad + i*((w-2*pad)/(data.length-1));
  const y=v=> h-pad - ((v-min)/range)*(h-2*pad);
  let line='', area='M '+x(0)+' '+y(data[0]), dots='';
  data.forEach((v,i)=>{ line+=(i?' L ':'M ')+x(i).toFixed(1)+' '+y(v).toFixed(1); area+=' L '+x(i).toFixed(1)+' '+y(v).toFixed(1); dots+=`<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3"/>`; });
  area+=` L ${x(data.length-1)} ${h-pad} L ${x(0)} ${h-pad} Z`;
  svg.innerHTML=`
    <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C9A15A" stop-opacity=".35"/><stop offset="100%" stop-color="#C9A15A" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#chartFill)"/>
    <path d="${line}" fill="none" stroke="#F0D38A" stroke-width="2.5" stroke-linejoin="round"/>
    <g fill="#3FB690">${dots}</g>`;
  document.getElementById('chartDays').innerHTML=DAY_LABELS[currentLang].map(l=>`<span>${l}</span>`).join('');
  const now=document.getElementById('chartPriceNow'); if(now) now.textContent=fmt(goldPricePerGram);
  const tr=document.getElementById('chartTrend');
  if(tr){ const up=data[data.length-1]>=data[0]; tr.textContent=up?'▲':'▼'; tr.className='chip-trend '+(up?'up':'down'); }
}
function bindCalculators(){
  const calc=()=>{
    const w=parseFloat(document.getElementById('calcWeight').value)||0;
    const k=parseInt(document.getElementById('calcKarat').value)||18;
    const wage=parseFloat(document.getElementById('calcWage').value)||0;
    const base=goldPricePerGram*w*(k/18); const total=(base+base*(wage/100))*1.07;
    document.getElementById('calcResult').textContent=fmt(total)+' '+I18N[currentLang].toman;
  };
  ['calcWeight','calcKarat','calcWage'].forEach(id=>{ const el=document.getElementById(id); if(el&&!el._b){ el._b=1; el.addEventListener('input',calc); } });
  calc();
  const bb=()=>{
    const w=parseFloat(document.getElementById('bbWeight').value)||0;
    const k=parseInt(document.getElementById('bbKarat').value)||18;
    // buy-back ~ 96% of pure metal value, no wage
    const val=goldPricePerGram*w*(k/18)*0.96;
    document.getElementById('bbResult').textContent=fmt(val)+' '+I18N[currentLang].toman;
  };
  ['bbWeight','bbKarat'].forEach(id=>{ const el=document.getElementById(id); if(el&&!el._b){ el._b=1; el.addEventListener('input',bb); } });
  bb();
}

/* ================= compare ================= */
let compareList=JSON.parse(sessionStorage.getItem('zg_compare')||'[]');
function saveCompare(){ sessionStorage.setItem('zg_compare',JSON.stringify(compareList)); }
function addToCompare(p){
  const d=I18N[currentLang];
  if(compareList.includes(p.id)){ toast('✓'); return; }
  if(compareList.length>=3){ toast(d.compareFull); return; }
  compareList.push(p.id); saveCompare(); renderCompareTray(); toast(d.compareAdded);
}
function removeCompare(id){ compareList=compareList.filter(x=>x!==id); saveCompare(); renderCompareTray(); if(document.getElementById('compareModal').classList.contains('open')) renderCompareModal(); }
function renderCompareTray(){
  const tray=document.getElementById('compareTray'), items=document.getElementById('trayItems');
  if(!tray) return;
  if(!compareList.length){ tray.classList.remove('show'); return; }
  tray.classList.add('show');
  items.innerHTML=compareList.map(id=>{ const p=PRODUCTS.find(x=>x.id===id); return `<span class="tray-chip">${p.name[currentLang]}<button data-tc="${id}">×</button></span>`; }).join('');
  items.querySelectorAll('[data-tc]').forEach(b=> b.addEventListener('click',()=> removeCompare(Number(b.dataset.tc))));
}
function renderCompareModal(){
  const d=I18N[currentLang]; const body=document.getElementById('compareBody');
  if(!compareList.length){ body.innerHTML=`<p class="cart-empty">${d.compareEmpty}</p>`; return; }
  const ps=compareList.map(id=>PRODUCTS.find(x=>x.id===id));
  const rows=[
    [d.compareName, ps.map(p=>p.name[currentLang])],
    [d.karat, ps.map(p=>p.karat)],
    [d.purity, ps.map(p=>p.karat===24?'99.9%':p.karat===21?'87.5%':'75%')],
    [d.weight, ps.map(p=>p.weight+' '+d.gram)],
    [d.wage, ps.map(p=>p.wage+'%')],
    ['', ps.map(p=>`<strong>${fmt(calcPrice(p).total)} ${d.toman}</strong>`)]
  ];
  body.innerHTML=`
    <div class="compare-cards">${ps.map(p=>`<div class="compare-card"><div class="cc-thumb">${productSVG(p)}</div><button class="cc-remove" data-cr="${p.id}">${d.compareRemove}</button></div>`).join('')}</div>
    <table class="compare-table"><tbody>
      ${rows.map(r=>`<tr><th>${r[0]}</th>${r[1].map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}
    </tbody></table>`;
  body.querySelectorAll('[data-cr]').forEach(b=> b.addEventListener('click',()=> removeCompare(Number(b.dataset.cr))));
}

/* ================= cart ================= */
function addToCart(p){ cart.push({id:p.id, name:p.name[currentLang], cat:p.cat, price:calcPrice(p).total}); saveLS(); updateCartCount(); toast(I18N[currentLang].added); }
function updateCartCount(){ document.getElementById('cartCount').textContent=cart.length; }
function renderCart(){
  const d=I18N[currentLang]; const body=document.getElementById('cartBody');
  if(!cart.length){ body.innerHTML=`<p class="cart-empty">${d.cartEmpty}</p>`; return; }
  const total=cart.reduce((s,i)=>s+i.price,0);
  body.innerHTML=cart.map((it,idx)=>`
    <div class="cart-item"><div class="cart-thumb">${productSVG({id:it.id,cat:it.cat})}</div>
    <div><div class="ci-name">${it.name}</div><div class="ci-price">${fmt(it.price)} ${d.toman}</div></div>
    <button class="cart-remove" data-rm="${idx}">×</button></div>`).join('')
    +`<div class="cart-total"><span>${d.cartTotal}</span><span>${fmt(total)} ${d.toman}</span></div>
      <button class="btn btn-gold btn-block">${d.cartCheckout}</button>`;
  body.querySelectorAll('[data-rm]').forEach(b=> b.addEventListener('click',()=>{ cart.splice(Number(b.dataset.rm),1); saveLS(); updateCartCount(); renderCart(); }));
}
document.getElementById('openCart').addEventListener('click',()=>{ renderCart(); openModal('cartModal'); });

/* ================= modal helpers ================= */
function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(ov=> ov.addEventListener('click',e=>{ if(e.target===ov) ov.classList.remove('open'); }));
document.querySelectorAll('[data-close]').forEach(b=> b.addEventListener('click',()=> b.closest('.modal-overlay').classList.remove('open')));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open')); });

/* ================= auth ================= */
document.getElementById('openAuth').addEventListener('click',()=> openModal('authModal'));
document.querySelectorAll('.tab-btn').forEach(b=> b.addEventListener('click',()=>{
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); document.querySelector(`[data-tab-panel="${b.dataset.tab}"]`).classList.add('active');
}));
document.getElementById('loginForm').addEventListener('submit',e=>{ e.preventDefault(); /* TODO backend POST /api/auth/login */ closeModal('authModal'); toast('✓'); });
document.getElementById('signupForm').addEventListener('submit',e=>{ e.preventDefault(); /* TODO backend POST /api/auth/signup */ closeModal('authModal'); toast('✓'); });

/* ================= MOCK BACKEND ================= */
const DB={
  getCoworkerRequests(){ return JSON.parse(localStorage.getItem('zg_cw_requests')||'[]'); },
  saveCoworkerRequests(l){ localStorage.setItem('zg_cw_requests',JSON.stringify(l)); },
  getAdminRequests(){ return JSON.parse(localStorage.getItem('zg_admin_requests')||'[]'); },
  saveAdminRequests(l){ localStorage.setItem('zg_admin_requests',JSON.stringify(l)); }
};

/* coworker flow */
document.getElementById('openCoworker').addEventListener('click',()=>{
  document.getElementById('coworkerStepRegister').classList.add('hidden');
  document.getElementById('coworkerStepPending').classList.add('hidden');
  document.getElementById('coworkerStepLogin').classList.remove('hidden');
  openModal('coworkerModal');
});
document.getElementById('showCoworkerRegister').addEventListener('click',()=>{
  document.getElementById('coworkerStepLogin').classList.add('hidden');
  document.getElementById('coworkerStepRegister').classList.remove('hidden');
});
document.getElementById('coworkerRegForm').addEventListener('submit',e=>{
  e.preventDefault();
  /* TODO backend: POST /api/coworkers/request (hash national code) */
  const req={id:Date.now(),firstName:cwFirstName.value.trim(),lastName:cwLastName.value.trim(),nationalCode:cwNationalCode.value.trim(),phone:cwPhone.value.trim(),approved:false};
  const l=DB.getCoworkerRequests(); l.push(req); DB.saveCoworkerRequests(l);
  e.target.reset();
  document.getElementById('coworkerStepRegister').classList.add('hidden');
  document.getElementById('coworkerStepPending').classList.remove('hidden');
});
document.getElementById('coworkerLoginForm').addEventListener('submit',e=>{
  e.preventDefault();
  /* TODO backend: POST /api/coworkers/login — verify + issue token server-side */
  const m=DB.getCoworkerRequests().find(r=>r.phone===cwLoginPhone.value.trim()&&r.nationalCode===cwLoginCode.value.trim()&&r.approved);
  if(m){ CURRENT_COWORKER=m; sessionStorage.setItem('zg_coworker_session',JSON.stringify(m)); closeModal('coworkerModal'); renderProducts(); toast('✓ '+m.firstName); }
  else alert(currentLang==='fa'?'درخواست شما هنوز تایید نشده یا اطلاعات نادرست است.':currentLang==='ar'?'لم تتم الموافقة على طلبك بعد أو المعلومات غير صحيحة.':'Your request is not approved yet, or details are incorrect.');
});

/* manager flow */
document.getElementById('openManager').addEventListener('click',()=> openModal('managerModal'));
document.getElementById('managerLoginForm').addEventListener('submit',e=>{
  e.preventDefault();
  /* TODO backend: manager auth MUST be server-side (hashed pw + session). DEMO ONLY: */
  if(managerUser.value.trim()==='manager'&&managerPass.value.trim()==='zomorod-admin'){
    closeModal('managerModal'); renderManagerDashboard(); openModal('managerDashModal');
  } else alert(currentLang==='fa'?'نام کاربری یا رمز عبور اشتباه است.':currentLang==='ar'?'اسم المستخدم أو كلمة المرور غير صحيحة.':'Incorrect username or password.');
});
function renderManagerDashboard(){
  const d=I18N[currentLang];
  const al=document.getElementById('pendingAdminList'), cl=document.getElementById('pendingCoworkerList');
  const admins=DB.getAdminRequests().filter(r=>!r.approved);
  al.innerHTML=admins.length?'':`<p class="pending-empty">${d.pendingEmpty}</p>`;
  admins.forEach(r=>{ const row=document.createElement('div'); row.className='pending-item';
    row.innerHTML=`<span>${r.username}</span><button class="approve-btn">${d.approve}</button>`;
    row.querySelector('button').addEventListener('click',()=>{ const a=DB.getAdminRequests(); a.find(x=>x.id===r.id).approved=true; DB.saveAdminRequests(a); renderManagerDashboard(); });
    al.appendChild(row); });
  const cws=DB.getCoworkerRequests().filter(r=>!r.approved);
  cl.innerHTML=cws.length?'':`<p class="pending-empty">${d.pendingEmpty}</p>`;
  cws.forEach(r=>{ const row=document.createElement('div'); row.className='pending-item';
    row.innerHTML=`<span>${r.firstName} ${r.lastName}<small>${r.phone}</small></span><button class="approve-btn">${d.approve}</button>`;
    row.querySelector('button').addEventListener('click',()=>{ const a=DB.getCoworkerRequests(); a.find(x=>x.id===r.id).approved=true; DB.saveCoworkerRequests(a); renderManagerDashboard(); });
    cl.appendChild(row); });
}
document.getElementById('openAdminLoginFromManager').addEventListener('click',()=>{ closeModal('managerDashModal'); openModal('adminLoginModal'); });

/* admin flow */
document.getElementById('adminLoginForm').addEventListener('submit',e=>{
  e.preventDefault();
  /* TODO backend: verify credentials AND manager-approval server-side. DEMO ONLY: */
  const reqs=DB.getAdminRequests(); let rec=reqs.find(r=>r.username===adminUser.value.trim());
  if(!rec){ rec={id:Date.now(),username:adminUser.value.trim(),approved:false}; reqs.push(rec); DB.saveAdminRequests(reqs); }
  if(adminPass.value.trim()!=='zomorod-content'){ alert(currentLang==='fa'?'رمز عبور اشتباه است.':currentLang==='ar'?'كلمة المرور غير صحيحة.':'Incorrect password.'); return; }
  if(!rec.approved){ alert(currentLang==='fa'?'دسترسی شما هنوز توسط مدیر تایید نشده است.':currentLang==='ar'?'لم يوافق المدير على وصولك بعد.':"Your access hasn't been approved by the manager yet."); return; }
  closeModal('adminLoginModal');
  document.getElementById('adminGoldPrice').value=Math.round(goldPricePerGram);
  document.getElementById('adminCoworkerDiscount').value=Number(localStorage.getItem('zg_coworker_discount'))||5;
  document.getElementById('adminMarqueeText').value=localStorage.getItem('zg_marquee_'+currentLang)||I18N[currentLang].marquee;
  const sel=document.getElementById('adminProductSelect'); sel.innerHTML=PRODUCTS.map(p=>`<option value="${p.id}">${p.name[currentLang]}</option>`).join('');
  openModal('adminPanelModal');
});
document.getElementById('adminProductFile').addEventListener('change',e=>{
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{ const id=document.getElementById('adminProductSelect').value; productImages[id]=ev.target.result; };
  reader.readAsDataURL(file);
});
document.getElementById('adminSaveBtn').addEventListener('click',()=>{
  /* TODO backend: PATCH /api/settings + upload images to storage (authenticated) */
  const ng=Number(document.getElementById('adminGoldPrice').value);
  const nd=Number(document.getElementById('adminCoworkerDiscount').value);
  const nm=document.getElementById('adminMarqueeText').value.trim();
  if(ng>0){ goldPricePerGram=ng; localStorage.setItem('zg_gold_base',String(ng)); }
  if(nd>=0) localStorage.setItem('zg_coworker_discount',String(nd));
  if(nm){ localStorage.setItem('zg_marquee_'+currentLang,nm); applyMarqueeOverride(); }
  localStorage.setItem('zg_product_images',JSON.stringify(productImages));
  document.getElementById('goldPriceValue').textContent=fmt(goldPricePerGram);
  renderProducts(); renderGallery(); renderBlog();
  document.getElementById('adminSavedNote').textContent=I18N[currentLang].saved;
  setTimeout(()=> document.getElementById('adminSavedNote').textContent='',2500);
});

/* ================= forms ================= */
document.getElementById('contactForm').addEventListener('submit',e=>{ e.preventDefault(); /* TODO backend POST /api/contact */ e.target.reset(); toast('✓'); });
document.getElementById('newsForm').addEventListener('submit',e=>{ e.preventDefault(); /* TODO backend POST /api/newsletter */ e.target.reset(); toast('✓'); });
document.getElementById('sortSelect').addEventListener('change',e=>{ currentSort=e.target.value; renderProducts(); });

/* ================= scroll spy + reveal ================= */
const spySections=['home','categories','products','gallery','about','blog','support','contact'];
window.addEventListener('scroll',()=>{
  const y=scrollY+130; let cur='home';
  spySections.forEach(id=>{ const el=document.getElementById(id); if(el&&el.offsetTop<=y) cur=id; });
  document.querySelectorAll('.nav-link').forEach(l=> l.classList.toggle('active',l.getAttribute('href')==='#'+cur));
});
const io=new IntersectionObserver(es=> es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }),{threshold:.12});
function observeReveals(){ document.querySelectorAll('section > .section-head, .trust-item, .cat-card, .guide-card, .testi-card, .blog-card, .support-card, .about-content, .about-visual, .tool-card, .verify-wrap, .trust-badge').forEach(el=>{ el.classList.add('reveal'); io.observe(el); }); }

/* ================= compare tray/modal bindings ================= */
document.getElementById('openCompare').addEventListener('click',()=>{ renderCompareModal(); openModal('compareModal'); });
document.getElementById('clearCompare').addEventListener('click',()=>{ compareList=[]; saveCompare(); renderCompareTray(); });

/* ================= init ================= */
applyI18n();
updateCartCount();
renderCompareTray();
observeReveals();