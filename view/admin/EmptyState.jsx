/* eslint-disable react/prop-types */

export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-8  rounded-md space-y-4">
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
}
