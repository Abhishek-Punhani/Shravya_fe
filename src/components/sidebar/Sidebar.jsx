import { useState } from "react";
import { SidebarHeader } from "./header"
import { Notifications } from "./notifications"
import { Searchbar } from "./searchbar";
import { Conversations } from "./conversations";




function Sidebar() {
    const [searchResults,setSearchResults]=useState([])
    return (
        <div className="w-[40%] h-full select-none">
            {/* Sidebar Header */}
            <SidebarHeader/>
            {/* Notifications */}
            <Notifications/>
            {/* Searchbar */}
           <Searchbar searchLength={searchResults.length}/>
           {/* Conversations */}
           <Conversations/>
        </div>
        
    )
}

export default Sidebar;
