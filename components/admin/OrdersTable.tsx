import Badge from "@/components/ui/Badge";
import type { Order } from "@/lib/types";

type OrdersTableProps = {
  orders: Order[];
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-600">Order ID</th>
            <th className="px-6 py-4 font-medium text-gray-600">Customer Name</th>
            <th className="px-6 py-4 font-medium text-gray-600">Email</th>
            <th className="px-6 py-4 font-medium text-gray-600">Phone</th>
            <th className="px-6 py-4 font-medium text-gray-600">Item</th>
            <th className="px-6 py-4 font-medium text-gray-600 text-right">Amount</th>
            <th className="px-6 py-4 font-medium text-gray-600 text-center">Status</th>
            <th className="px-6 py-4 font-medium text-gray-600">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#F97316]">
                  {order._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.userInfo?.name}</td>
                <td className="px-6 py-4 text-gray-500">{order.userInfo?.email}</td>
                <td className="px-6 py-4 text-gray-500">{order.userInfo?.phone}</td>
                <td className="px-6 py-4 text-gray-600">
                  {order.items?.map((item) => item.title).filter(Boolean).join(", ") || "-"}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 text-right">₹{order.totalAmount}</td>
                <td className="px-6 py-4 text-center">
                  <Badge status={order.status} />
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-gray-500 font-medium">
                No orders found for the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
