import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';
import { STORIES } from '@/data/stories';
import { getMemoryLogs } from '@/app/api/v1/telemetry/pageview/route';

export async function GET() {
  try {
    const memoryLogs = getMemoryLogs();
    
    // Attempt Supabase fetch
    const { data: dbViews } = await supabase
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    const views = (dbViews && dbViews.length > 0) ? dbViews : memoryLogs.map(m => ({
      session_id: m.sessionId,
      path: m.path,
      page_title: m.title,
      place_id: m.placeId,
      story_id: m.storyId,
      device_type: m.deviceType,
      created_at: m.timestamp
    }));

    const now = new Date().getTime();
    const fiveMinsAgo = now - 5 * 60 * 1000;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1. Calculate Realtime Active Users (Last 5 mins)
    const activeSessions = new Set<string>();
    // 2. Path aggregations
    const pathViewMap: Record<string, number> = {};
    const pathUserMap: Record<string, Set<string>> = {};
    const pathTitleMap: Record<string, string> = {};

    // 3. Place & Story aggregations
    const placeMap: Record<string, number> = {};
    const storyMap: Record<string, number> = {};

    // 4. Device breakdown
    const deviceMap: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
    const allSessions = new Set<string>();
    const todaySessions = new Set<string>();

    views.forEach((v: any) => {
      const path = v.path || '/';
      const session = v.session_id || 'anon';
      const created = new Date(v.created_at || Date.now()).getTime();

      allSessions.add(session);
      if (created >= todayStart.getTime()) {
        todaySessions.add(session);
      }

      if (created >= fiveMinsAgo) {
        activeSessions.add(session);
      }

      // Path views
      pathViewMap[path] = (pathViewMap[path] || 0) + 1;
      if (!pathUserMap[path]) pathUserMap[path] = new Set();
      pathUserMap[path].add(session);

      if (v.page_title) {
        pathTitleMap[path] = v.page_title;
      }

      // Place views
      if (v.place_id) {
        placeMap[v.place_id] = (placeMap[v.place_id] || 0) + 1;
      }
      // Infer place ID from path e.g. /place/govindaraja
      if (path.startsWith('/place/')) {
        const pId = path.replace('/place/', '');
        placeMap[pId] = (placeMap[pId] || 0) + 1;
      }

      // Story reads
      if (v.story_id) {
        storyMap[v.story_id] = (storyMap[v.story_id] || 0) + 1;
      }
      if (path.startsWith('/story/')) {
        const sSlug = path.replace('/story/', '');
        storyMap[sSlug] = (storyMap[sSlug] || 0) + 1;
      }

      const dev = v.device_type || 'Mobile';
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;
    });

    // Friendly page titles
    const getFriendlyTitle = (path: string) => {
      if (pathTitleMap[path]) return pathTitleMap[path];
      if (path === '/') return 'Home (Quick to Reach & Decision Verdict)';
      if (path === '/explore') return 'Explore Places (Nearby Engine)';
      if (path === '/learn/story-of-the-day') return 'Story of the Day (Daily Companion)';
      if (path === '/learn/stories') return 'Story Library & Search';
      if (path === '/trip-estimator') return 'Saarthi Trip & Transport Estimator';
      if (path.startsWith('/place/')) {
        const pId = path.replace('/place/', '');
        const p = PLACES.find(item => item.id === pId);
        return p ? `Place: ${p.name}` : `Place Detail (${pId})`;
      }
      if (path.startsWith('/story/')) {
        const sSlug = path.replace('/story/', '');
        const s = STORIES.find(item => item.slug === sSlug || item.id === sSlug);
        return s ? `Story: ${s.title}` : `Story Detail (${sSlug})`;
      }
      return path;
    };

    const totalViewsCount = views.length;

    // Rank Most Viewed Pages
    const mostViewedPages = Object.entries(pathViewMap)
      .map(([path, totalViews]) => {
        const uniqueVisitors = pathUserMap[path] ? pathUserMap[path].size : 1;
        const sharePercentage = totalViewsCount > 0 ? Math.round((totalViews / totalViewsCount) * 100) : 0;
        return {
          path,
          pageTitle: getFriendlyTitle(path),
          totalViews,
          uniqueVisitors,
          sharePercentage
        };
      })
      .sort((a, b) => b.totalViews - a.totalViews);

    // Top Visited Places
    const topVisitedPlaces = Object.entries(placeMap)
      .map(([id, viewsCount]) => {
        const place = PLACES.find(p => p.id === id);
        return {
          placeId: id,
          name: place?.name || id,
          category: place?.category || 'Spiritual',
          views: viewsCount
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Top Read Stories
    const topStoriesRead = Object.entries(storyMap)
      .map(([slug, readCount]) => {
        const story = STORIES.find(s => s.slug === slug || s.id === slug);
        return {
          storyId: slug,
          title: story?.title || slug,
          category: story?.category || 'Tradition',
          reads: readCount
        };
      })
      .sort((a, b) => b.reads - a.reads)
      .slice(0, 5);

    const totalSessionsCount = allSessions.size;

    // Calculate device percentages
    const totalDevices = (deviceMap.Mobile || 0) + (deviceMap.Desktop || 0) + (deviceMap.Tablet || 0);
    const mobilePct = totalDevices > 0 ? Math.round(((deviceMap.Mobile || 0) / totalDevices) * 100) : 100;
    const desktopPct = totalDevices > 0 ? Math.round(((deviceMap.Desktop || 0) / totalDevices) * 100) : 0;
    const tabletPct = totalDevices > 0 ? Math.max(0, 100 - mobilePct - desktopPct) : 0;

    const avgPages = totalSessionsCount > 0 ? (totalViewsCount / totalSessionsCount).toFixed(1) : '1.0';

    return NextResponse.json({
      success: true,
      summary: {
        totalVisitors: {
          today: todaySessions.size,
          last7Days: allSessions.size,
          last30Days: allSessions.size,
          totalAllTime: allSessions.size
        },
        totalPageviews: totalViewsCount,
        liveActiveNow: activeSessions.size,
        avgPagesPerSession: `${avgPages} pages`,
        mostViewedPages,
        topVisitedPlaces,
        topStoriesRead,
        deviceBreakdown: {
          mobile: mobilePct,
          desktop: desktopPct,
          tablet: tabletPct
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate analytics summary' }, { status: 500 });
  }
}
