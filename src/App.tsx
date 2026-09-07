/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoFeed } from './components/VideoFeed';

export default function App() {
  return (
    <main className="w-full min-h-screen bg-[#0A0A0A] text-[#F8F8F8] selection:bg-[#FFE100] selection:text-[#0A0A0A] font-sans">
      <VideoFeed />
    </main>
  );
}
