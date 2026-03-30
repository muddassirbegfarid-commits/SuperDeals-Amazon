interface AdPlaceholderProps {
  type: 'banner' | 'sidebar' | 'footer';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  const styles = {
    banner: "w-full h-24 md:h-32 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm my-8",
    sidebar: "w-full h-64 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm",
    footer: "w-full h-48 bg-gray-100 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-sm mt-12"
  };

  return (
    <div className={styles[type]}>
      <div className="text-center">
        <p className="font-bold">Adsterra Ad Placement</p>
        <p className="text-xs italic">Place your script here</p>
        {/* <!-- Adsterra Script Here --> */}
      </div>
    </div>
  );
}
