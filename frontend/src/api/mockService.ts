// In-memory mock service for instant live showcasing on Vercel or offline testing
export const DEMO_USER = {
  id: 'd9b1c784-5a23-4d89-9a12-872f23b109c1',
  email: 'alex.d@saasflow.co',
  fullName: 'Alex Devon',
  full_name: 'Alex Devon',
  role: 'owner',
  workspace_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  workspace: {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Vortex Workspace',
    slug: 'vortex-workspace'
  },
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
};

const SAMPLE_ACTIVITIES = [
  { action: 'Updated billing settings to Annual Enterprise Tier', status: 'SUCCESS', ip: '192.168.1.101', minAgo: 4 },
  { action: 'Exported quarterly CSV analytics audit report', status: 'SUCCESS', ip: '192.168.1.42', minAgo: 12 },
  { action: 'Failed login attempt from unauthorized IP range', status: 'FAILED', ip: '45.133.1.89', minAgo: 25 },
  { action: 'Generated new developer production API key', status: 'SUCCESS', ip: '192.168.1.101', minAgo: 48 },
  { action: 'Invited team member sarah.c@saasflow.co (Viewer)', status: 'PENDING', ip: '192.168.1.15', minAgo: 72 },
  { action: 'Modified webhook destination endpoint URL', status: 'SUCCESS', ip: '192.168.1.101', minAgo: 95 },
  { action: 'Rate limit threshold exceeded (429 Too Many Requests)', status: 'FAILED', ip: '104.28.19.4', minAgo: 110 },
  { action: 'Updated organization security policy to enforce 2FA', status: 'SUCCESS', ip: '192.168.1.101', minAgo: 130 },
  { action: 'Rotated JWT master signing secret key', status: 'SUCCESS', ip: '192.168.1.101', minAgo: 180 },
  { action: 'Triggered manual database backup snapshot', status: 'SUCCESS', ip: '192.168.1.20', minAgo: 240 },
  { action: 'Revoked legacy OAuth integration token', status: 'SUCCESS', ip: '192.168.1.101', minAgo: 320 },
  { action: 'Sync customer telemetry events from Segment stream', status: 'SUCCESS', ip: '192.168.1.88', minAgo: 400 },
];

export function getMockResponse(_method: string, url: string, data?: any) {
  const cleanUrl = url.replace(/^[a-zA-Z]+:\/\/[^/]+/, ''); // remove host
  const path = cleanUrl.split('?')[0];
  const searchParams = new URLSearchParams(cleanUrl.includes('?') ? cleanUrl.split('?')[1] : '');

  // 1. Auth Login
  if (path.includes('/auth/login')) {
    const email = data?.email || 'alex.d@saasflow.co';
    return {
      status: 200,
      data: {
        access_token: 'mock_jwt_access_token_demo_mode',
        refresh_token: 'mock_jwt_refresh_token_demo_mode',
        token_type: 'bearer',
        user: { ...DEMO_USER, email }
      }
    };
  }

  // 2. Auth Register
  if (path.includes('/auth/register')) {
    const email = data?.email || 'new.user@saasflow.co';
    const fullName = data?.fullName || 'New User';
    return {
      status: 200,
      data: {
        access_token: 'mock_jwt_access_token_demo_mode',
        refresh_token: 'mock_jwt_refresh_token_demo_mode',
        token_type: 'bearer',
        user: { ...DEMO_USER, email, fullName, full_name: fullName }
      }
    };
  }

  // 3. Auth Refresh
  if (path.includes('/auth/refresh')) {
    return {
      status: 200,
      data: {
        access_token: 'mock_jwt_access_token_refreshed',
        refresh_token: 'mock_jwt_refresh_token_refreshed',
        token_type: 'bearer',
        user: DEMO_USER
      }
    };
  }

  // 4. Auth Me
  if (path.includes('/auth/me')) {
    return {
      status: 200,
      data: DEMO_USER
    };
  }

  // 5. Auth Logout
  if (path.includes('/auth/logout')) {
    return {
      status: 200,
      data: { message: 'Logged out successfully' }
    };
  }

  // 6. Dashboard Stats (KPIs)
  if (path.includes('/dashboard/stats')) {
    const tf = searchParams.get('timeframe') || '30d';
    const statsMap: Record<string, any[]> = {
      '7d': [
        { key: 'total_revenue', title: 'Total Revenue', value: '$14,200', delta: '+5.4%', deltaDirection: 'positive', icon: 'dollar-sign' },
        { key: 'active_users', title: 'Active Users', value: '1,940', delta: '+3.1%', deltaDirection: 'positive', icon: 'users' },
        { key: 'conversion_rate', title: 'Conversion Rate', value: '3.45%', delta: '+0.8%', deltaDirection: 'positive', icon: 'target' },
        { key: 'avg_response_time', title: 'Avg Response Time', value: '238ms', delta: '+2.1%', deltaDirection: 'positive', icon: 'clock' },
      ],
      '30d': [
        { key: 'total_revenue', title: 'Total Revenue', value: '$48,250', delta: '+12.5%', deltaDirection: 'positive', icon: 'dollar-sign' },
        { key: 'active_users', title: 'Active Users', value: '2,847', delta: '+8.3%', deltaDirection: 'positive', icon: 'users' },
        { key: 'conversion_rate', title: 'Conversion Rate', value: '3.24%', delta: '-1.2%', deltaDirection: 'negative', icon: 'target' },
        { key: 'avg_response_time', title: 'Avg Response Time', value: '245ms', delta: '+4.6%', deltaDirection: 'positive', icon: 'clock' },
      ],
      '90d': [
        { key: 'total_revenue', title: 'Total Revenue', value: '$128,400', delta: '+22.4%', deltaDirection: 'positive', icon: 'dollar-sign' },
        { key: 'active_users', title: 'Active Users', value: '8,450', delta: '+18.6%', deltaDirection: 'positive', icon: 'users' },
        { key: 'conversion_rate', title: 'Conversion Rate', value: '3.12%', delta: '-0.5%', deltaDirection: 'negative', icon: 'target' },
        { key: 'avg_response_time', title: 'Avg Response Time', value: '255ms', delta: '+6.2%', deltaDirection: 'positive', icon: 'clock' },
      ],
    };
    return {
      status: 200,
      data: {
        timeframe: tf,
        metrics: statsMap[tf] || statsMap['30d']
      }
    };
  }

  // 7. Dashboard Charts
  if (path.includes('/dashboard/charts')) {
    const tf = searchParams.get('timeframe') || '30d';
    let engagement = [
      { date: 'Sep 01', sessions: 1420 },
      { date: 'Sep 05', sessions: 1650 },
      { date: 'Sep 10', sessions: 1920 },
      { date: 'Sep 15', sessions: 2150 },
      { date: 'Sep 20', sessions: 2480 },
      { date: 'Sep 25', sessions: 2847 },
    ];
    let trafficTotal = '2.8k';

    if (tf === '7d') {
      engagement = [
        { date: 'Mon', sessions: 1850 },
        { date: 'Tue', sessions: 2100 },
        { date: 'Wed', sessions: 2350 },
        { date: 'Thu', sessions: 2200 },
        { date: 'Fri', sessions: 2650 },
        { date: 'Sat', sessions: 2400 },
        { date: 'Sun', sessions: 2847 },
      ];
      trafficTotal = '1.9k';
    } else if (tf === '90d') {
      engagement = [
        { date: 'Jul', sessions: 14500 },
        { date: 'Aug', sessions: 19800 },
        { date: 'Sep', sessions: 28470 },
      ];
      trafficTotal = '8.5k';
    }

    return {
      status: 200,
      data: {
        timeframe: tf,
        engagement,
        trafficTotal,
        trafficChannels: [
          { name: 'Direct', percentage: 40, color: '#4F46E5' },
          { name: 'Organic', percentage: 35, color: '#10B981' },
          { name: 'Referral', percentage: 15, color: '#F59E0B' },
          { name: 'Social', percentage: 10, color: '#EF4444' },
        ]
      }
    };
  }

  // 8. Dashboard Activities
  if (path.includes('/dashboard/activities')) {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '4', 10);
    const status = (searchParams.get('status') || '').toLowerCase();
    const search = (searchParams.get('search') || '').toLowerCase();

    let filtered = SAMPLE_ACTIVITIES.map((item, idx) => ({
      id: `activity-${idx + 1}`,
      user: {
        name: DEMO_USER.fullName,
        email: DEMO_USER.email,
        avatar: DEMO_USER.avatarUrl
      },
      action: item.action,
      ipAddress: item.ip,
      status: item.status,
      timestamp: `${item.minAgo}m ago`,
      createdAt: new Date(Date.now() - item.minAgo * 60000).toISOString()
    }));

    if (status && status !== 'all') {
      filtered = filtered.filter(a => a.status.toLowerCase() === status);
    }
    if (search) {
      filtered = filtered.filter(a =>
        a.action.toLowerCase().includes(search) ||
        a.ipAddress.toLowerCase().includes(search) ||
        a.user.name.toLowerCase().includes(search)
      );
    }

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
    const startIdx = (page - 1) * limit;
    const paginatedData = filtered.slice(startIdx, startIdx + limit);

    return {
      status: 200,
      data: {
        data: paginatedData,
        pagination: {
          currentPage: page,
          limit,
          totalRecords,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    };
  }

  return null;
}
