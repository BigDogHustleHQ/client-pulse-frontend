// ⚠️ MOCK ENDPOINT — GET /api/mock/vendors
// The mock data for the Vendors page lives here and ONLY here. The page and its
// hook consume this shape and react to it; swap this body for a real backend
// and nothing downstream changes. Route handlers are uncached by default, so
// each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { VendorsData } from '@/types/vendors';

export async function GET() {
  const data: VendorsData = {
    category: 'Dairy',
    lanes: [
      { id: 'leads', label: 'Leads' },
      { id: 'contacted', label: 'Contacted' },
      { id: 'quoted', label: 'Quoted' },
      { id: 'signed', label: 'Signed' },
    ],
    vendors: [
      {
        id: 'burrata-co',
        lane: 'leads',
        name: 'Burrata Co.',
        rating: 4.2,
        poc: 'Sam Ortiz',
        status: 'new',
      },
      {
        id: 'fresh-bros',
        lane: 'leads',
        name: 'Fresh Bros',
        rating: 3.9,
        poc: 'Lena Park',
        status: 'new',
      },
      {
        id: 'valley-farm',
        lane: 'contacted',
        name: 'Valley Farm',
        rating: 4.8,
        poc: 'Sam Reyes',
        status: 'pending',
      },
      {
        id: 'hill-dairy',
        lane: 'quoted',
        name: 'Hill Dairy',
        rating: 4.5,
        price: '$5.10/lb',
        poc: 'Avi Cohen',
        status: 'pending',
      },
      {
        id: 'town-co-op',
        lane: 'quoted',
        name: 'Town Co-op',
        rating: 4.1,
        price: '$4.95/lb',
        poc: 'Mara Lin',
        status: 'pending',
      },
      {
        id: 'coast-cream',
        lane: 'signed',
        name: 'Coast Cream',
        rating: 4.9,
        price: '$5.40/lb',
        poc: 'Dana Webb',
        status: 'signed',
      },
    ],
    coldEmail: {
      vendorId: 'burrata-co',
      title: 'Cold email — Burrata Co.',
      prompt:
        'Draft a warm, concise cold email to a dairy vendor introducing our 90-seat bistro and asking for a wholesale quote on fresh mozzarella.',
      draft:
        "Hi Sam, we run a 90-seat bistro two blocks from your creamery and go through ~40 lbs of fresh mozzarella a week. We'd love a wholesale quote and a sample to taste this month. Could we set up a quick call? Thanks — Maria",
      confidence: 0.88,
    },
  };

  const body: MockEnvelope<VendorsData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
