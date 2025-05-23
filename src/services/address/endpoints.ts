// Cache provinces data which rarely changes
const PROVINCES_CACHE_KEY = 'vietnam_provinces_cache';
const PROVINCES_CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function getProvinces() {
    // Check cache first
    try {
        const cachedData = localStorage.getItem(PROVINCES_CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Use cache if it's not expired
            if (Date.now() - timestamp < PROVINCES_CACHE_EXPIRY) {
                console.log('Using cached provinces data');
                return data;
            }
        }
        
        // Fetch fresh data if cache missing or expired
        const response = await fetch('https://vapi.vnappmob.com/api/v2/province/');
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Update cache
        localStorage.setItem(PROVINCES_CACHE_KEY, JSON.stringify({
            data: data.results || [],
            timestamp: Date.now()
        }));
        
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch provinces:", error);
        
        // Try to use expired cache as fallback in case of network error
        const cachedData = localStorage.getItem(PROVINCES_CACHE_KEY);
        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            return data;
        }
        
        return [];
    }
}

// Similarly cache district data with a province-specific key
const getDistrictCacheKey = (province_id: string) => `vietnam_districts_${province_id}`;

export async function getDistricts(province_id: string) {
    // Check cache first
    try {
        const cachedData = localStorage.getItem(getDistrictCacheKey(province_id));
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Use cache if it's not expired
            if (Date.now() - timestamp < PROVINCES_CACHE_EXPIRY) {
                console.log(`Using cached districts data for province ${province_id}`);
                return data;
            }
        }
        
        // Fetch fresh data if cache missing or expired
        const response = await fetch(`https://vapi.vnappmob.com/api/v2/province/district/${province_id}`);
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Update cache
        localStorage.setItem(getDistrictCacheKey(province_id), JSON.stringify({
            data: data.results || [],
            timestamp: Date.now()
        }));
        
        return data.results || [];
    } catch (error) {
        console.error(`Failed to fetch districts for province ${province_id}:`, error);
        
        // Try to use expired cache as fallback in case of network error
        const cachedData = localStorage.getItem(getDistrictCacheKey(province_id));
        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            return data;
        }
        
        return [];
    }
}

export async function getWards(district_id: string) {
    try {
        const response = await fetch(`https://vapi.vnappmob.com/api/v2/province/ward/${district_id}`);
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Failed to fetch wards for district ${district_id}:`, error);
        return [];
    }
}