require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: city, error: cityError } = await supabase.from('cities').select('*').eq('slug', 'tirupati').single();
  console.log('City:', city, cityError);

  if (city) {
    const { data: places, error: placesError } = await supabase.from('places').select('id, name, status').eq('city_id', city.id);
    console.log('Places count:', places?.length, placesError);
    if (places?.length > 0) {
      console.log('First place:', places[0]);
    }
  }
}
test();
