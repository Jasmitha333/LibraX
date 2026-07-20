type AvatarProps = {
  name: string;
};

function Avatar({ name }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
      {initials}
    </div>
  );
}

export default Avatar;