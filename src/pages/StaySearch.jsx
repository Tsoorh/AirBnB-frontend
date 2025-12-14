import { useEffect, useState } from "react"
import { loadStays } from "../store/actions/stay.actions"
import { useSearchParams } from 'react-router-dom'
import { useSelector } from "react-redux"
import { StayList } from "../cmps/StayList"
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { StaySearchSkeleton } from '../cmps/Skeletons'




export function StaySearch(){
    const [searchParams] = useSearchParams()
    const stays = useSelector(storeState => storeState.stayModule.stays)
    const [mapCenter, setMapCenter] = useState({ lat: 32.0853, lng: 34.7818 })
    const [mapZoom, setMapZoom] = useState(8)



    useEffect(() => {
        loadStays()
    },[searchParams])

    // Update map center and zoom when stays change
    useEffect(() => {
        if (stays.length > 0 && stays[0].loc) {
            setMapCenter({ lat: stays[0].loc.lat, lng: stays[0].loc.lng })
            setMapZoom(12) // Zoom in closer when filtering by city
        }
    }, [stays])
        
    if (!stays?.length) {
        return <StaySearchSkeleton />
    }
        
    return(
        <section className="stay-search">
            <div className="results-stay-list">
                <StayList
                    stays={stays}
                    inSearchPage={true}
                />
            </div>

            <div className="map-container">
                <APIProvider apiKey={import.meta.env.VITE_GMAP_KEY}>
                    <Map
                        center={mapCenter}
                        zoom={mapZoom}
                        mapId="bf51a910020fa25a"
                        style={{ width: '100%', height: '100%' }}
                    >
                        {stays.map((stay) => {
                            if (!stay.loc || !stay.loc.lat || !stay.loc.lng) {
                                console.log('Stay missing location:', stay.name)
                                return null
                            }
                            return (
                                <AdvancedMarker
                                    key={stay._id}
                                    position={{ lat: stay.loc.lat, lng: stay.loc.lng }}
                                >
                                    <div className="price-stay-on-map">
                                        ₪{stay.price.base}
                                    </div>
                                </AdvancedMarker>
                            )
                        })}
                                {/* <AdvancedMarker position={mapCenter} /> */}

                    </Map>
                </APIProvider>
            </div>
        </section>
    )
}
