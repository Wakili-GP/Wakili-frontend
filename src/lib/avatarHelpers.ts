export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return `${first} ${last}`;
};

export const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-rose-200 text-rose-800",
    "bg-sky-200 text-sky-800",
    "bg-emerald-200 text-emerald-800",
    "bg-violet-200 text-violet-800",
    "bg-amber-200 text-amber-800",
    "bg-cyan-200 text-cyan-800",
  ];

  // Get the same index for every name
  const index =
    name.split("").reduce((acc, curr) => acc + curr.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};
