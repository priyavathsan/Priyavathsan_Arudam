import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ProfileImageProps {
  name: string;
  imagePath: string;
  title?: string;
  description?: string;
  onImageClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ name, imagePath, title, description, onImageClick }) => {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-amber-500/40 bg-cosmic-900/80 shadow-lg hover:shadow-xl hover:border-amber-400/60 transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-cosmic-950">
        {onImageClick ? (
          <button
            type="button"
            onClick={onImageClick}
            aria-label={`View ${name} biography`}
            className="block w-full h-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
          >
            <img
              src={imagePath}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ) : (
          <img
            src={imagePath}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-3 text-center">
        <h3 className="font-semibold text-amber-300 text-sm">
          {name}
        </h3>
        {title && (
          <p className="text-xs text-slate-400 mt-1">
            {title}
          </p>
        )}
        {description && (
          <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export const AstrologerProfiles: React.FC = () => {
  const { language } = useLanguage();
  const [activeProfile, setActiveProfile] = useState<'ramanuja' | 'agasthiya' | null>(null);
  const [biographyLanguage, setBiographyLanguage] = useState(language);
  const isTamil = biographyLanguage === 'ta';

  const openProfile = (profile: 'ramanuja' | 'agasthiya') => {
    setBiographyLanguage(language);
    setActiveProfile(profile);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-cosmic-950/50 rounded-xl border border-amber-500/20">
        <ProfileImage
          name="Srimad Ramanujar"
          imagePath="/Ramanuja.jpg"
          title="Vedic Scholar"
          description="Inspiration for Vedic knowledge"
          onImageClick={() => openProfile('ramanuja')}
        />

        <ProfileImage
          name="Sri Agasthiya Maha Rishi"
          imagePath="/Agathiyar.jpg"
          title="Siddha Sage"
          description="Ancient author of Tamil astrology"
          onImageClick={() => openProfile('agasthiya')}
        />

        <ProfileImage
          name="Priyavathsan Sridharan Iyengar"
          imagePath="/Priyavathsan_Ohm_shirt.png"
          title="Astrology Practitioner"
          description="Contact: +91-9486483808"
        />
      </div>

      {activeProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setActiveProfile(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
            onClick={event => event.stopPropagation()}
            className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl border border-amber-500/40 bg-cosmic-950 p-5 sm:p-7 text-slate-200 shadow-2xl ${isTamil ? 'font-tamil' : ''}`}
          >
            <button
              type="button"
              onClick={() => setActiveProfile(null)}
              aria-label="Close biography"
              className="absolute right-4 top-4 rounded-md px-2 py-1 text-xl text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              ×
            </button>

            <div className="mb-5 flex gap-1 rounded-lg border border-slate-700 bg-cosmic-900 p-1 w-fit" aria-label="Biography language">
              <button
                type="button"
                onClick={() => setBiographyLanguage('en')}
                aria-pressed={!isTamil}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${!isTamil ? 'bg-amber-500 text-cosmic-950' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setBiographyLanguage('ta')}
                aria-pressed={isTamil}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isTamil ? 'bg-amber-500 text-cosmic-950' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                தமிழ்
              </button>
            </div>

            {activeProfile === 'ramanuja' ? (
              <article className="space-y-4 pr-8">
                <h2 id="profile-dialog-title" className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {isTamil ? 'ஸ்ரீ பகவத் ராமானுஜாச்சார்ய ஸ்வாமிகள்' : 'Sri Bhagawad Ramanujacharya Swami'}
                </h2>
                {isTamil ? (
                  <>
                    <p><strong>ஸ்ரீ பகவத் ராமானுஜாச்சார்ய ஸ்வாமிகள்</strong>, சமூகத்தில் சமத்துவத்தை நிலைநாட்டவும், அனைத்து மக்களின் உயர்விற்காகவும் தமது வாழ்நாள் முழுவதையும் அர்ப்பணித்த முதல் ஆச்சார்யர்களில் ஒருவராகப் போற்றப்படுகிறார். கி.பி. 1017-ஆம் ஆண்டு அவதரித்த அவர், வேதங்களிலும் வேதாந்தத்திலும் அசைக்க முடியாத நம்பிக்கை கொண்டிருந்தார்.</p>
                    <p>உலகம் முழுவதும் நிலவ வேண்டிய சமத்துவத்தின் உயரிய கருத்துக்கள் <strong>பகவத் கீதை, ஸ்ரீமத் ராமாயணம், புராணங்கள்</strong> மற்றும் பிற சாஸ்திரங்களில் எடுத்துரைக்கப்பட்டிருப்பதை அவர் எடுத்துக்காட்டினார்.</p>
                    <h3 className="text-lg font-semibold text-amber-200">ராமானுஜாச்சார்யரின் இலக்கியப் பங்களிப்புகள்</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li><strong>பிரம்ம சூத்திரங்கள் மற்றும் உபநிஷத்துகளுக்கு</strong> ஆழமான மற்றும் தெளிவான உரைகளை அருளி, சமூகத்தின் பல்வேறு பிரிவுகளுக்கு இடையே ஒரு சிறந்த பாலமாகத் திகழ்ந்தார்.</li>
                      <li><strong>‘குரு’ என்ற திருநாமம் ராமானுஜருக்கு மிகவும் பொருத்தமானது.</strong> அவர் சமூகத்தை உள்ளும் புறமும் சீர்திருத்தி, கோயில்களை தர்மம் மற்றும் சேவையின் மையங்களாக உருவாக்கினார்.</li>
                      <li><strong>திருமலை ஸ்ரீ வேங்கடேஸ்வரப் பெருமாள்</strong>, ராமானுஜரைத் தமது ஆச்சார்யராக ஏற்று, அவரிடமிருந்து <strong>சங்கு மற்றும் சக்கரங்களை</strong> பெற்றதாக வைணவ மரபில் போற்றப்படுகிறது.</li>
                      <li><strong>பக்தி இயக்கத்தின் முன்னோடிகளில் ஒருவராக</strong> விளங்கிய அவர், பல்வேறு பக்தி மரபுகளுக்கு அடித்தளமாக அமைந்த விசிஷ்டாத்வைத தத்துவத்தைப் பரப்பினார். மத்வர், நிம்பார்க்கர், கௌடிய மரபு, சுவாமிநாராயணர், வல்லபாச்சாரியார், இஸ்கான் (ISKCON), ஏகநாதர், ராமானந்தர், சைதன்யர், கபீர், சூர்தாஸ், மீராபாய், துளசிதாஸ், அன்னமாச்சாரியார் மற்றும் பலரின் பக்தி மரபுகளிலும் இதன் தாக்கம் காணப்படுகிறது.</li>
                      <li><strong>‘ஆச்சார்யர்’ என்ற சிறப்புப் பட்டம் ராமானுஜாச்சார்யருக்கு மிகவும் பொருத்தமானது.</strong> திருமலை ஸ்ரீ வேங்கடேஸ்வரப் பெருமாளுடன் தொடர்புடைய வைணவ மரபில், ராமானுஜர் ஆச்சார்யராகப் போற்றப்படுவதுடன், சங்கு மற்றும் சக்கரங்களும் அவருடன் தொடர்புபடுத்திப் போற்றப்படுகின்றன.</li>
                      <li>சுமார் <strong>120 ஆண்டுகள்</strong> நீண்ட தமது வாழ்நாள் முழுவதும், அனைத்து உயிர்களும் கர்ம பந்தத்திலிருந்து விடுபடுவதற்கான பரம உபாயமாக <strong>ஸ்ரீமன் நாராயணனை</strong> அடைய வேண்டும் என்ற தத்துவத்தை மக்களுக்கு போதித்தார்.</li>
                      <li><strong>விசிஷ்டாத்வைத தத்துவத்தை</strong> விரிவாக எடுத்துரைத்து, கோயில்களை <strong>தர்மத்தின் மையங்களாக</strong> உருவாக்கினார்.</li>
                      <li>அவர் அருளிய <strong>ஒன்பது முக்கியமான நூல்கள்</strong>, வேத மற்றும் வேதாந்த இலக்கியங்களுக்கு என்றும் வழிகாட்டும் ஒளிவிளக்குகளாகத் திகழ்கின்றன.</li>
                      <li>உலகெங்கும் சமத்துவம் மற்றும் ஸ்ரீவைஷ்ணவ சித்தாந்தத்தின் செய்தியைப் பரப்புவதற்காக <strong>74 சிம்மாசனாதிபதிகளை</strong> நிறுவினார்.</li>
                      <li><strong>ஸ்ரீரங்கத்தில் அவரது திருமேனி இன்றும் வழிபாட்டில் உள்ளது.</strong></li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p><strong>Sri Bhagawad Ramanujacharya Swami</strong> is considered as the first Acharya who devoted his entire life for the upliftment of equality in society. Born in 1017 AD, he had unquestioned faith in the validity of Vedas and Vedantas.</p>
                    <p>He found records in our scriptures, the Bhagavad Githa, Srimad Ramayana, Puranas etc., which propagated the vision of equality needed across the world.</p>
                    <h3 className="text-lg font-semibold text-amber-200">Ramanujacharya’s Literary Contributions</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>He gave perfect commentaries to Bramha Sutras and Upanishads and made a perfect bridge between different sections of society.</li>
                      <li>The word guru aptly suits Ramanuja as he reformed society inside out and set up temples as centers of service.</li>
                      <li>Lord Venkateshwara of Tirumala accepted Ramanuja as guru and accepted sankha and chakra from him.</li>
                      <li>He pioneered the Bhakthi Movement and advocated a philosophy that formed the basis for several Bhakthi Movements: Madhya, Nimbarka, Gauda, Swami Narayana, Vallabhacharya, ISKCON, Eknath, Ramanand, Chaithanya, Kabir, Surdas, Meerabai, Tulasidas, Annamacharya and many others.</li>
                      <li>The title ‘acharya’ rightly fits Ramanujacharya because Lord Venkateswara was initiated by him and received Sankham and Chakram.</li>
                      <li>He tirelessly worked for 120 years, teaching that Lord Sriman Narayana is the ultimate redeemer from the karmic bondage of all souls.</li>
                      <li>He expounded the Visishtadwaitha school of thought and made temples centers of Dharma.</li>
                      <li>His nine scholarly works are beacon lights for Veda and Vedanta literature.</li>
                      <li>He established 74 authoritative acharyas to spread the message of equality across the world.</li>
                      <li>His divine body is worshipped even today in Srirangam.</li>
                    </ul>
                  </>
                )}
              </article>
            ) : (
              <article className="space-y-4 pr-8">
                <h2 id="profile-dialog-title" className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                  {isTamil ? 'அகத்தியர் முனிவர் (Agasthiya Muni)' : 'Agasthiya Muni'}
                </h2>
                {isTamil ? (
                  <>
                    <p><strong>அகத்தியர் முனிவர்</strong> தமிழ்ச் சித்தர் மரபில் மிகப் பழமையானதும் சிறப்புமிக்கதுமான ஞானியாகப் போற்றப்படுகிறார். தமிழ் இலக்கியம், சித்த மருத்துவம், யோகம், ஜோதிடம் மற்றும் ஆன்மிக ஞானம் போன்ற பல துறைகளுடன் அகத்தியர் மரபு தொடர்புபடுத்தப்படுகிறது.</p>
                    <p><strong>ஆரூட மரபில்</strong>, அகத்தியரின் பெயருடன் தொடர்புபடுத்தப்படும் முறைகள், ஒருவர் மனதில் நினைக்கும் கேள்விக்கு ஒரு குறிப்பிட்ட குறி, எண் அல்லது ஆரூட முறையின் மூலம் வழிகாட்டும் பாரம்பரியமாகக் கருதப்படுகின்றன. இம்மரபில் கிடைக்கும் விளக்கங்கள் <strong>பாரம்பரிய ஆன்மிக/ஜோதிட நம்பிக்கைகளின் அடிப்படையிலானவை</strong>; அவை அறிவியல் ரீதியாக நிரூபிக்கப்பட்ட கணிப்புகள் அல்ல.</p>
                    <blockquote className="border-l-2 border-amber-400 pl-4 italic text-amber-100">“அகத்தியர் அருளிய ஞான மரபை அடிப்படையாகக் கொண்டு, கேள்விக்கான குறியீட்டின் மூலம் பாரம்பரிய வழிகாட்டலை வழங்குவதே இந்த ஆரூட அணுகுமுறையின் நோக்கமாகும்.”</blockquote>
                  </>
                ) : (
                  <>
                    <p><strong>Agasthiya Muni (Sage Agastya)</strong> is one of the most revered sages in the Tamil Siddhar tradition. He is traditionally associated with Tamil literature, Siddha medicine, yoga, spirituality, astrology, and ancient wisdom.</p>
                    <p>In <strong>Arudam traditions</strong>, methods associated with Agasthiya are traditionally understood as ways of seeking guidance for a question through a specific sign, number, symbol, or Arudam procedure. The interpretation is based on traditional spiritual and astrological teachings.</p>
                    <blockquote className="border-l-2 border-amber-400 pl-4 italic text-amber-100">“This Arudam approach draws upon the traditional wisdom attributed to Sage Agasthiya, using an Arudam indication to provide traditional guidance for the question being asked.”</blockquote>
                    <p className="text-sm text-slate-400">Note: These interpretations belong to traditional spiritual/astrological practice and are not scientifically validated predictions.</p>
                  </>
                )}
              </article>
            )}
          </section>
        </div>
      )}
    </>
  );
};
