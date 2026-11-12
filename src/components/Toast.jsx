// Black pill at the bottom-center. Renders nothing when `message` is empty.
export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0B0B0B] text-white px-6 py-4 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-[13px] max-w-[90vw] text-center"
    >
      {message}
    </div>
  );
}
