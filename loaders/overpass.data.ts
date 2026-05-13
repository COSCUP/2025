import venueGeometryData from '#data/venue-geometry.json'
import { defineLoader } from 'vitepress'

interface OverpassData {
  venueGeometry: GeoJSON.GeoJsonObject
  buildingGeometries: GeoJSON.GeoJsonObject
}

/**
 * The geometry of the venue and its buildings.
 *
 * Captured from the Overpass API (post-osmtogeojson) and shipped as static data —
 * the queries are fully deterministic (fixed OSM IDs) and the live API is unstable.
 *
 * To refresh, re-query the following OSM objects via Overpass and run the result
 * through `osmtogeojson`:
 * - `relation(5355856)` — 國立臺灣科技大學 (NTUST, the venue)
 * - `way(646301762)` — 綜合研究大樓 (RB)
 * - `way(646293060)` — 研揚大樓 (TR)
 */
export declare const data: OverpassData

export default defineLoader({
  async load(): Promise<OverpassData> {
    return venueGeometryData as OverpassData
  },
})
