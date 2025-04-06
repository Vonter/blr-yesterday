# blr-yesterday

The code that powers [BLR Yesterday](https://blryesterday.com)

## Develop

- Install dependencies with `pnpm install` (or `npm install`)
- Start local dev server with `pnpm run dev` (or `npm run dev`)
- Build site deployment assets with `pnpm run build` (or `npm run build`)

## Planned

- Map
    - Preload adjacent years/tiles
- Images (Migrate https://otd.vonter.top)
    - Atom feed
    - Search feature
    - Custom annotations
    - Location metadata to use on map
- Other
    - Gazette
    - Reports
    - State Archives

## Maps

The maps have been sourced from multiple places:
- 1790: https://artsandculture.google.com/asset/bengaluru-karnataka-robert-home/KgF0MfabwOrhJg
- 1840: https://commons.wikimedia.org/wiki/File:Plan_of_Bangalore_Cantonment_1843.jpg
- 1850: https://commons.wikimedia.org/wiki/File:Bangalore_1854_Pharaoh_hires.jpg
- 1880: [Mod Foundation archives](https://mod.org.in/)
- 1900: https://britishlibrary.oldmapsonline.org/maps/5c5f6ea9-8f24-5df6-9fc1-ad11ecfbcdc1/
- 1910: https://www.raremaps.com/gallery/detail/55788/map-of-country-10-miles-around-bangalore-anonymous
- 1940: https://umedia.lib.umn.edu/item/p16022coll246:577 and [Mod Foundation archives](https://mod.org.in/)
- 1960: [Mod Foundation archives](https://mod.org.in/)
- 1980: [Mod Foundation archives](https://mod.org.in/)
- 2000 (City): [Bengawalk](https://bengawalk.com)
- 2000 (Region): [Bengawalk](https://bengawalk.com)
- 2005: https://www.arcgis.com/home/item.html?id=903f0abe9c3b452dafe1ca5b8dd858b9
- 2015: https://www.arcgis.com/home/item.html?id=9badc1f6b6a64a609a87fc75e8a6b083
- Today: https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9

The scanned maps are made available on the site using the following steps:
1. Georeferenced using the [Georeferencer](https://docs.qgis.org/3.34/en/docs/user_manual/working_with_raster/georeferencer.html) plugin for QGIS.
2. Exported to GeoTIFF format.
3. Saved as XYZ tiles using [gdal2tiles](https://gdal.org/en/latest/programs/gdal2tiles.html)
4. Uploaded to an R2 Bucket on Cloudflare.

If you'd like to contribute a new map, create an [issue](https://github.com/Vonter/blr-yesterday/issues) with details about the map.
