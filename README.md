# blr-yesterday

The code that powers [BLR Yesterday](https://blryesterday.com)

## Develop

- Install dependencies with `pnpm install` (or `npm install`)
- Start local dev server with `pnpm run dev` (or `npm run dev`)
- Build site deployment assets with `pnpm run build` (or `npm run build`)

### Configuration

The default configuration in `src/lib/config.ts` builds the site for BLR. To build the site for a different city, update the `src/lib/config.ts` file with the configuration for that city.

### Data

The site serves media assets based on the contents of `static/media.json` and `static/daily.json`. The media assets are curated separately from this code repository.

## Planned

- Media integration
  - Explore view with media search
    - Search feature
    - Custom annotations
- Map
  - Horizontal slider to compare maps side-by-side
- Other
  - Gazette
  - Reports
  - State Archives
  - Pictures

## Sources

The maps, photographs and documents have been sourced from multiple places.

### Maps

- 1790: Published in 1791 (Plan of the Siege of Bangalore, Lord Cornwallis) - https://artsandculture.google.com/asset/bengaluru-karnataka-robert-home/KgF0MfabwOrhJg
- 1840: Published in 1843 (Plan of the Cantonment of Bangalore, B.C. Regel) - https://commons.wikimedia.org/wiki/File:Plan_of_Bangalore_Cantonment_1843.jpg
- 1850: Published in 1854 (Pharoah & Co., Madras; J. & C. Walker) - https://commons.wikimedia.org/wiki/File:Bangalore_1854_Pharaoh_hires.jpg
- 1880: Published in 1884 (Multiple individuals, unknown organization) - Mythic Society; INTACH Bengaluru; Chandan Biligunda
- 1900: Published in 1935 (John Bartholomew) - https://britishlibrary.oldmapsonline.org/maps/5c5f6ea9-8f24-5df6-9fc1-ad11ecfbcdc1/
- 1910: Published in 1910 (Litho. School 2nd Q.V.O.S. & M in Bangalore) - https://www.raremaps.com/gallery/detail/55788/map-of-country-10-miles-around-bangalore-anonymous
- 1920: Published in 1927 (Survey of India) - https://zenodo.org/records/15028333
- 1940: Surveyed 1935-36. Published in 1948 (Survey of India) - https://umedia.lib.umn.edu/item/p16022coll246:577 and [Mod Foundation archives](https://mod.org.in/)
- 1960: Surveyed 1960-61. Published in 1969 (Survey of India) - [Mod Foundation archives](https://mod.org.in/)
- 1960 (Region): Published in 1958 (Survey of India) - https://zenodo.org/records/15028333
- 1980: Surveyed 1979-80. Published in 1983 (Survey of India) - [Mod Foundation archives](https://mod.org.in/)
- 1980 (Region): Published in 1978 (Survey of India) - https://zenodo.org/records/15028333
- 2000: Surveyed 1997-99. Published in 2002 (Survey of India) - [Bengawalk](https://bengawalk.com)
- 2000 (Region): Surveyed across multiple decades in the late 20th Century, with major details updated around 2000. Published in 2011 (Survey of India) - [Bengawalk](https://bengawalk.com)
- Background: [OpenStreetMap](https://openstreetmap.in) (OpenStreetMap contributors)

The scanned maps are made available on the site using the following steps:

1. Georeferenced using the [Georeferencer](https://docs.qgis.org/3.34/en/docs/user_manual/working_with_raster/georeferencer.html) plugin for QGIS.
2. Exported to GeoTIFF format.
3. Saved as XYZ tiles using [gdal2tiles](https://gdal.org/en/latest/programs/gdal2tiles.html)
4. Uploaded to an R2 Bucket on Cloudflare.

If you'd like to contribute a new map, create an [issue](https://github.com/Vonter/blr-yesterday/issues) with details about the map.

The satellite imagery has been sourced from ESRI:

- 200x: Satellite images captured in different areas across multiple years through the 2000s - https://www.arcgis.com/home/item.html?id=903f0abe9c3b452dafe1ca5b8dd858b9
- 2015: Satellite images captured in different areas across multiple years prior to 2015 - https://www.arcgis.com/home/item.html?id=9badc1f6b6a64a609a87fc75e8a6b083
- Today: Satellite images captured after 2022 - https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9

### Photographs

The source for each photograph is shown when the photograph is viewed on the site. The full list of photographs can be found in the [media.json](static/media.json)

## AI Declaration

Components of this repository, including code and documentation, were written with assistance from Claude AI.
