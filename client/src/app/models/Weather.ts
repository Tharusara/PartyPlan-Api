export interface Weather{
    city: string | string[];
    date?: string;
    weather?: Data;  
    fromDate?: string;
    toDate?: string;
     
}

export interface Locations{
    name: string;
    lat: number;
    lon: number;
}

export interface WeatherData{
    city: string[];
    fromDate?: string;
    toDate?: string;     
}

export interface Data{
    timestamp:string;
    source_id:number;
    precipitation:number;
    pressure_msl:number;
    sunshine:number;
    temperature:number;
    wind_direction:number;
    wind_speed:number;
    cloud_cover:number;
    dew_point:number;
    relative_humidity:number;
    visibility:number;
    wind_gust_direction:number;
    wind_gust_speed:number;
    condition:string;
    fallback_source_ids:{
       visibility:number;
       cloud_cover:number
    };
    icon:string
 }