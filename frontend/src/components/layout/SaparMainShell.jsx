import { useState } from "react";

import BottomNavbar from "./BottomNavbar";

import DiscoveryScreen from "../../screens/DiscoveryScreen";
import ItineraryScreen from "../../screens/ItineraryScreen";
import POIScreen       from "../../screens/POIScreen";
import FavoritesScreen from "../../screens/FavoritesScreen";
import ProfileScreen   from "../../screens/ProfileScreen";

import { useLikes }     from "../../hooks/useLikes";
import { useItinerary } from "../../hooks/useItinerary";
import { useSettings }  from "../../hooks/useSettings";

export default function SaparMainShell() {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showPOI, setShowPOI]     = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState(null);
    const [offlineMode, setOfflineMode]   = useState(false);

    const { likedIds, toggleLike }             = useLikes();
    const { items, routeLocationIds, addToRoute, removeFromRoute, reorderItems } = useItinerary();
    const { settings, setSettings }            = useSettings();

    const handleLocationTap = (loc) => {
        setSelectedLocation(loc);
        setShowPOI(true);
    };

    const renderScreen = () => {
        if (showPOI && selectedLocation) {
            return (
                <POIScreen
                    location={selectedLocation}
                    onBack={() => setShowPOI(false)}
                    isLiked={likedIds.has(selectedLocation.id)}
                    onToggleLike={toggleLike}
                    isInRoute={routeLocationIds.has(selectedLocation.id)}
                    onAddToRoute={addToRoute}
                />
            );
        }

        switch (activeTab) {
            case 0: return (
                <DiscoveryScreen
                    onLocationTap={handleLocationTap}
                    onAIRoute={() => setActiveTab(1)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
            );
            case 1: return (
                <ItineraryScreen
                    items={items}
                    onItemsChange={reorderItems}
                    offlineMode={offlineMode}
                    onOfflineModeChange={setOfflineMode}
                    onRemoveItem={removeFromRoute}
                />
            );
            case 2: return (
                <FavoritesScreen
                    likedIds={likedIds}
                    onLocationTap={handleLocationTap}
                    onToggleLike={toggleLike}
                />
            );
            case 3: return (
                <ProfileScreen
                    settings={settings}
                    onSettingsChange={setSettings}
                />
            );
            default: return null;
        }
    };

    return (
        <div className="fixed top-0 left-0 z-50 flex h-screen w-full flex-col overflow-y-auto bg-white font-sans text-slate-900 antialiased">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {renderScreen()}
            </div>

            {!showPOI && (
                <BottomNavbar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    likedCount={likedIds.size}
                />
            )}
        </div>
    );
}
