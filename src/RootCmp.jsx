import React from 'react'
import { Routes, Route } from 'react-router'

import { HomePage } from './pages/HomePage'
// import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StayIndex } from './pages/StayIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'
import { PhotoTour } from './pages/PhotoTour'

import { StayDetails } from './pages/StayDetails'
import { UserDetails } from './pages/UserDetails'
import { HostDetails } from './pages/HostDetails'
import { Order } from './pages/Order'
import { StaySearch } from './pages/StaySearch'
import { Dashboard } from './pages/Dashboard.jsx'
import { StayEditPage } from './pages/StayEditPage'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { Wishlist } from './pages/Wishlist.jsx'
import { HelpCenter } from './pages/HelpCenter.jsx'
import { Messages } from './pages/Messages.jsx'


export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <UserMsg />

            <main>
                <Routes>
                    <Route path="" element={<HomePage />} />
                    {/* <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
                    <Route path="stay" element={<StayIndex />} />
                    <Route path="stay/:stayId" element={<StayDetails />} />
                    <Route path="stay/:stayId/photos" element={<PhotoTour />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="help" element={<HelpCenter />} />
                    <Route path="host/:hostId" element={<HostDetails />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat/:chatId" element={<ChatApp />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="messages/:chatId" element={<Messages />} />
                    <Route path="stay/:stayId/order" element={<Order />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="search" element={<StaySearch />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="dashboard/add-listing" element={<StayEditPage />} />
                    <Route path="dashboard/edit-listing/:stayId" element={<StayEditPage />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    )
}


