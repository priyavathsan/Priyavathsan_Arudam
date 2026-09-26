import React from 'react';

interface ProfileImageProps {
  name: string;
  imagePath: string;
  title?: string;
  description?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ name, imagePath, title, description }) => {
  return (
    <div className="rounded-xl overflow-hidden border-2 border-amber-500/40 bg-cosmic-900/80 shadow-lg hover:shadow-xl hover:border-amber-400/60 transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-cosmic-950">
        <img
          src={imagePath}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-cosmic-950/50 rounded-xl border border-amber-500/20">
      {/* Srimad Ramanujar */}
      <ProfileImage
        name="Srimad Ramanujar"
        imagePath="/Ramanuja.jpg"
        title="Vedic Scholar"
        description="Inspiration for Vedic knowledge"
      />

      {/* Sri Agasthiya Maha Rishi */}
      <ProfileImage
        name="Sri Agasthiya Maha Rishi"
        imagePath="/Agathiyar.jpg"
        title="Siddha Sage"
        description="Ancient author of Tamil astrology"
      />

      {/* Priyavathsan Sridharan Iyengar */}
      <ProfileImage
        name="Priyavathsan Sridharan Iyengar"
        imagePath="/Priyavathsan_Ohm_shirt.png"
        title="Astrology Practitioner"
        description="Contact: +91-9486483808"
      />
    </div>
  );
};
