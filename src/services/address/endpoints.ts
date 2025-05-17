export async function getProvinces() {
    try {
        const response = await fetch('https://vapi.vnappmob.com/api/v2/province/');
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch provinces:", error);
        // Return empty array instead of throwing to prevent UI crashes
        return [];
    }
}

export async function getDistricts(province_id: string) {
    try {
        const response = await fetch(`https://vapi.vnappmob.com/api/v2/province/district/${province_id}`);
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Failed to fetch districts for province ${province_id}:`, error);
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