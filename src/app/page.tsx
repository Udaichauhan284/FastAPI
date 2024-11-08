"use client"; //this i am using, for using the react use state and all, client side rendering
import { useEffect, useState, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

const Home = () => {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear the previous timeout before setting a new one
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to fetch data after the debounce delay
    debounceTimeoutRef.current = setTimeout(async () => {
      if (!input) {
        setSearchResults(undefined);
        return;
      }

      try {
        const res = await fetch(`https://fastapi.udaichauhan284.workers.dev/api/search?q=${input}`);
        const data = (await res.json()) as { results: string[]; duration: number };
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 500); // Set the debounce delay here, e.g., 500ms

    // Clean up the timeout when the component unmounts
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [input]);

  return (
    <main className="h-screen w-screen grainy">
    <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
    <h1 className="text-5xl tracking-tight font-bold">FastSearch ⚡</h1>
    <p className="text-zinc-600 text-lg max-w-prose text-center">
    A high-performance API built with Hono, Next.js and Cloudflare. <br />{' '}
    Type a query below and get your results in miliseconds.
    </p>

    <div className="max-w-md w-full">
      <Command>
        <CommandInput 
          value={input}
          onValueChange={setInput}
          placeholder="Search countries..."
          className="placeholder:text-size-500"
        />
        <CommandList>
          {searchResults?.results.length === 0 ? (
            <CommandEmpty>No Result Found.</CommandEmpty>
          ): null}

          {searchResults?.results ? (
            <CommandGroup heading="Results">
              {searchResults?.results.map((result) => (
                <CommandItem
                key={result}
                value={result}
                onSelect={setInput}
                >{result}</CommandItem>
              ))}
            </CommandGroup>
          ): null}

          {searchResults?.results ? (
            <>
              <div className="h-px w-full bg-zinc-200" />
              <p className="p-2 text-xs text-zinc-500">
                Found {searchResults.results.length} results in{' '}
                {searchResults?.duration.toFixed(0)}ms
              </p>
            </>
          ): null}
        </CommandList>
      </Command>
    </div>
    </div>
    </main>
  );
};

export default Home;