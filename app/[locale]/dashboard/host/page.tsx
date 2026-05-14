import { getHostBookings } from '@/app/actions/booking'
import { GlobalHeader } from '@/components/shared/GlobalHeader'
import { Footer } from '@/app/components/layout/Footer'
import { PriceDisplay } from '@/app/components/ui/PriceDisplay'

export default async function HostDashboard({ params }: { params: { locale: string } }) {
  const bookings = await getHostBookings()
  const totalEarnings = bookings.reduce((sum: number, b: any) => sum + (b.status === 'CONFIRMED' ? b.total_price : 0), 0)

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <GlobalHeader activeTab="stays" />
      
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-12 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-1">Host Dashboard</h1>
            <p className="text-zinc-500">Welcome back, manage your listings and earnings.</p>
          </div>
          <button className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Create new listing
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Total Earnings</span>
            <div className="flex items-end gap-4 mb-4">
              <h2 className="text-4xl font-black text-zinc-900">
                <PriceDisplay priceBDT={totalEarnings} />
              </h2>
            </div>
            {/* Simple Sparkline Chart */}
            <div className="flex items-end gap-1 h-12">
              {[30, 45, 25, 60, 50, 80, 70, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-zinc-100 rounded-t-sm transition-all hover:bg-zinc-900" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Active Bookings</span>
            <h2 className="text-3xl font-black text-zinc-900">{bookings.filter((b: any) => b.status === 'CONFIRMED').length}</h2>
            <div className="mt-4 flex items-center gap-2 text-zinc-500 text-xs font-bold">
              <span>Next check-in: Tomorrow</span>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Host Rating</span>
            <h2 className="text-3xl font-black text-zinc-900">4.98</h2>
            <div className="mt-4 flex items-center gap-2 text-amber-500 text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
              <span>Superhost Status</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-zinc-900">Recent Transactions</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-bold bg-zinc-100 rounded-full">All</button>
              <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-50 rounded-full transition-all">Confirmed</button>
              <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-50 rounded-full transition-all">Pending</button>
            </div>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>You don't have any bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="pb-4 font-black text-[10px] uppercase text-zinc-400">Guest</th>
                    <th className="pb-4 font-black text-[10px] uppercase text-zinc-400">Listing</th>
                    <th className="pb-4 font-black text-[10px] uppercase text-zinc-400">Dates</th>
                    <th className="pb-4 font-black text-[10px] uppercase text-zinc-400">Status</th>
                    <th className="pb-4 font-black text-[10px] uppercase text-zinc-400 text-right">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any) => (
                    <tr key={booking.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                      <td className="py-5 font-bold text-zinc-900">
                        {booking.profiles?.full_name || 'Anonymous Guest'}
                      </td>
                      <td className="py-5 text-zinc-600 max-w-[200px] truncate">
                        {booking.listings?.title || 'Villa in Sylhet'}
                      </td>
                      <td className="py-5 text-zinc-600">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{booking.start_date}</span>
                          <span className="text-[10px] text-zinc-400">to {booking.end_date}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-5 text-right font-black text-zinc-900">
                        <PriceDisplay priceBDT={booking.total_price} />
                      </td>
                      <td className="py-5 text-right">
                        {booking.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <button className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-all" title="Accept">
                              <span className="material-symbols-outlined text-sm">check</span>
                            </button>
                            <button className="h-8 w-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-all" title="Decline">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
