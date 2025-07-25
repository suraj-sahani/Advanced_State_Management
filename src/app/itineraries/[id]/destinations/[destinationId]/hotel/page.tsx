import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { selectHotel } from './actions';

export default async function HotelBookingPage(
  props: {
    params: Promise<{ id: string; destinationId: string }>;
  }
) {
  const params = await props.params;
  const destination = await db.query.destinations.findFirst({
    where: eq(destinations.id, params.destinationId),
  });

  if (!destination) {
    notFound();
  }

  const hotels = [
    {
      name: 'The Grand Hotel',

      price: 250,
      rating: 4,
      location: 'Union Square, San Francisco',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDG6MYti24oB3zpVh9EE6ERTW1JydiWxN6D9h3lmbtXcQT4a2vPacgZ9tAf8RTn-w85-x8n-Wvk9HRcIhVRNpfoJ3E-Hnn-D2gHkc9OoCNO5aRBqpXpsV3gvgepN6zeqoaZ1rxeD4DUcvuMmSCoF_sNq_QazAi9iuL3wf9hDgyMH6p4Z6arI_EIRQcQ2OCVgpVgwzOFxUqLOYrzfhow_f9FxqBQvxXw-XrIdaUQjqzZYSpdKPw71JYoeVtgeEtE9X6biLqrErh9OZE',
    },
    {
      name: 'The Ritz-Carlton',
      price: 350,
      rating: 5,
      location: 'Financial District, San Francisco',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ8R6HWSArK-V7wo7TuKOSyI_9zRCRR1uNd3LUfeRLY3PlkQNUEeqr_N78jt3BzV3Btr2ZWk--zVKTZGZSy2dpLsV-1kJv5APMQPuGXRXP4B3cFSLyDiqBCgvcTOo3HjMCuvxKzqum5eO1-5Tk07WtRcIaltRQAnzH0VvT18bMrnOiqA_y8mX50U7mHwcRSfsxn0ic0RtTDmvMfjwXt3sP2IEYVqqtVTlbHtcNeTlWXa-Vlf22cr0zNGgskI-VN1FPwRvCiXgkaGU',
    },
    {
      name: 'Hotel Nikko',
      price: 180,
      rating: 3,
      location: 'Union Square, San Francisco',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCaAUDkj0VByYO5MEjAOLRHPU_Um_2YfVyGc9OSdFpquksWKbdOIZJr8za6JHMFOO0qZoQ6Lq8QdsTBob16SiOYgmkrXI9-CVttPmxX_r49CUCaqwxyXZQ2PqS7jExKizMq0g7m5sCJ1b5z00N6lLiAuzZqICPIsQkjmJBfmB8gxO_7TFVSXZJ1jbIvO9vKiW4PlvIGFVZ8vhB8Qc6TCTmByYC7Q1NiM919sHXzzDjfR87ZXFVqcVcw9rPyLBEew2u7I-FZPTChg9M',
    },
    {
      name: 'The Hyatt Regency',
      price: 220,
      rating: 4,
      location: 'Embarcadero, San Francisco',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCju06MAmADp6k9LVjc_B67VOHaupK7KQBgLili20-8pyPlm44QTG3HaJGqnTOhsgHv7Kz32qF5_5hhi8rjNhXPa-2MixocrYdRGRY591JlJA3Hiww27BmIazfbf9YxlA7EzPjIZPK-jTjQpubCOIqBMG4G5iPkPIuU7acoExTLH6cteSwoPs_9jGJhHHtEDb8M7PUucWjKkReFJEP6swaa1tq0d1OF8_qd8YDy2-q__eyiynPgHveHINzr9zFD1CI0hwaQbdXR76w',
    },
    {
      name: 'The Four Seasons',
      price: 400,
      rating: 5,
      location: 'SoMa, San Francisco',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD0BVLxdI6ckOxJJCBnPLkHbxx05R1MS0VhDCbLcy5wdKJTjmQdxfOsTdPiQh_-tZ9mvl1wfYA_3gT3yqzNEMs82fd8e4MBmMlO5mwsO_adw-okRXB7yuzsR4Tdd3DkG6OnWPEPiVIQiLZGZFEHtPLxirdKWCRtS_eTxpgGNX61qdRMGYzfQMX9J0nsBEOaT4YHN9nmA2iiLnH8azeiXKzqAiigaK-JfNB2kCVRllbJuH7Yoq8iG1YQlfG_2M5b9zWbNR27TkLnBxg',
    },
    {
      name: 'The Holiday Inn',
      price: 150,
      rating: 3,
      location: "Fisherman's Wharf, San Francisco",
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAOI0yI6plYla_duRWHTenLofcD7f_V30TlXgabdzJlUw8ewVHAnMP3VJS2wdh2B4mbDP7onl06vacbQq-mjj5KrGuo7tbgcbwu1SXYKZWKr0MaLs8x9RAGSv2As_zh5fKCvmEJ0mNJkVkgE3cTENrcTzmgxZd3VNECl-fTAHuxqcSLfoJqkju0pM0v4rGSd62P_O1-y4BoXETRSPdaK-zVeqe98sI37x9cKTcMviaHtDmCUyCJdM-MSlvSsXVWfsQCxtsen-oJBno',
    },
  ];

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-80">
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#60768a] dark:text-[#8b9bab] flex border-none bg-[#f0f2f5] dark:bg-[#1a1d1f] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f2f5] dark:bg-[#1a1d1f] focus:border-none h-full placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                value={destination.location}
              />
              <div className="flex items-center justify-center rounded-r-xl border-l-0 border-none bg-[#f0f2f5] dark:bg-[#1a1d1f] pr-2 pr-4">
                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent text-[#111518] dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] h-auto min-w-0 px-0">
                  <div className="text-[#60768a] dark:text-[#8b9bab]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </label>
        </div>
        <h3 className="text-[#111518] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Dates
        </h3>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Check-in
            </p>
            <input
              type="date"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal"
              defaultValue={destination.arrivalDate}
            />
          </label>
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Check-out
            </p>
            <input
              type="date"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal"
              defaultValue={destination.departureDate}
            />
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Guests
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal"
              placeholder="1 room, 2 adults"
            />
          </label>
        </div>
        <h3 className="text-[#111518] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Filters
        </h3>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Price range
            </p>
            <select className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 bg-[image:--select-button-svg] placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal">
              <option value="one"></option>
              <option value="two">two</option>
              <option value="three">three</option>
            </select>
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Star rating
            </p>
            <select className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 bg-[image:--select-button-svg] placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal">
              <option value="one"></option>
              <option value="two">two</option>
              <option value="three">three</option>
            </select>
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Guest rating
            </p>
            <select className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 bg-[image:--select-button-svg] placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal">
              <option value="one"></option>
              <option value="two">two</option>
              <option value="three">three</option>
            </select>
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Property type
            </p>
            <select className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 bg-[image:--select-button-svg] placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal">
              <option value="one"></option>
              <option value="two">two</option>
              <option value="three">three</option>
            </select>
          </label>
        </div>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#111518] dark:text-white text-base font-medium leading-normal pb-2">
              Amenities
            </p>
            <select className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe1e6] dark:border-[#2a2d2f] bg-white dark:bg-[#1a1d1f] focus:border-[#dbe1e6] dark:focus:border-[#2a2d2f] h-14 bg-[image:--select-button-svg] placeholder:text-[#60768a] dark:placeholder:text-[#8b9bab] p-[15px] text-base font-normal leading-normal">
              <option value="one"></option>
              <option value="two">two</option>
              <option value="three">three</option>
            </select>
          </label>
        </div>
        <div className="flex px-4 py-3">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#0b80ee] dark:bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Show {hotels.length} stays</span>
          </button>
        </div>
      </div>
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#111518] dark:text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
            {destination.location}
          </p>
        </div>
        <div className="pb-3">
          <div className="flex border-b border-[#dbe1e6] dark:border-[#2a2d2f] px-4 gap-8">
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#60768a] dark:text-[#8b9bab] pb-[13px] pt-4"
              href="#"
            >
              <p className="text-[#60768a] dark:text-[#8b9bab] text-sm font-bold leading-normal tracking-[0.015em]">
                Map
              </p>
            </a>
            <a
              className="flex flex-col items-center justify-center border-b-[3px] border-b-[#111518] dark:border-b-white text-[#111518] dark:text-white pb-[13px] pt-4"
              href="#"
            >
              <p className="text-[#111518] dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
                List
              </p>
            </a>
          </div>
        </div>
        {hotels.map((hotel) => (
          <form
            key={hotel.name}
            action={async () => {
              'use server';
              await selectHotel(params.id, params.destinationId, {
                name: hotel.name,
                price: hotel.price,
                checkIn: destination.arrivalDate,
                checkOut: destination.departureDate,
              });
            }}
          >
            <button className="w-full">
              <div className="p-4">
                <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-[#1a1d1f] p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_rgba(0,0,0,0.3)]">
                  <div className="flex flex-[2_2_0px] flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#60768a] dark:text-[#8b9bab] text-sm font-normal leading-normal">
                        {hotel.rating} stars
                      </p>
                      <p className="text-[#111518] dark:text-white text-base font-bold leading-tight">
                        {hotel.name}
                      </p>
                      <p className="text-[#60768a] dark:text-[#8b9bab] text-sm font-normal leading-normal">
                        {hotel.location}
                      </p>
                    </div>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 flex-row-reverse bg-[#f0f2f5] dark:bg-[#2a2d2f] text-[#111518] dark:text-white text-sm font-medium leading-normal w-fit">
                      <span className="truncate">${hotel.price}</span>
                    </button>
                  </div>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                    style={{ backgroundImage: `url("${hotel.image}")` }}
                  ></div>
                </div>
              </div>
            </button>
          </form>
        ))}
        <div className="flex items-center justify-center p-4">
          <a href="#" className="flex size-10 items-center justify-center">
            <div className="text-[#111518] dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18px"
                height="18px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
              </svg>
            </div>
          </a>
          <a
            className="text-sm font-bold leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-[#111518] dark:text-white rounded-full bg-[#f0f2f5] dark:bg-[#2a2d2f]"
            href="#"
          >
            1
          </a>
          <a
            className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111518] dark:text-white rounded-full"
            href="#"
          >
            2
          </a>
          <a
            className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111518] dark:text-white rounded-full"
            href="#"
          >
            3
          </a>
          <a
            className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111518] dark:text-white rounded-full"
            href="#"
          >
            4
          </a>
          <a
            className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111518] dark:text-white rounded-full"
            href="#"
          >
            5
          </a>
          <a href="#" className="flex size-10 items-center justify-center">
            <div className="text-[#111518] dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18px"
                height="18px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
