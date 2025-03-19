import { Product } from "@/mockData";
export default function ItemComponent({ onClose, item }: { onClose: () => void, item: Product }) {
    return (
        <div className="w-full h-full border p-4 bg-gray-100 rounded shadow">
            <p>This is where the item needs fix</p>
            <p>{item.id}</p>
            <div className="flex flex-row gap-2 mt-4">
                <button>Update</button>
                <button>Open in new window</button>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
}