import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import IndividualsUserIsInterestedInForEvent from "./IndividualsUserIsInterestedInForEvent";

import TeamsCreatedPerEventByUser from "./TeamsCreatedPerEventByUser";
import TeamsUserIsInterestedInForEvent from "./TeamsUserIsInterestedInForEvent";
import { useEvents } from "../../core/hooks/useEvents";

function Leads() {
  const { events } = useEvents();

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const selectedEvent = events.find((event) => event.name === value);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full sm:w-[200px] justify-between"

            >
              {value
                ? events.find((event) => event.name === value)?.name
                : "Select event..."}
              <ChevronsUpDown className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full sm:w-[200px] p-0">

            <Command>
              <CommandInput placeholder="Search event..." className="h-9" />
              <CommandList>
                <CommandEmpty>No event found.</CommandEmpty>
                <CommandGroup>
                  {events.map((event) => (
                    <CommandItem
                      key={event.id}
                      value={event.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {event.name}
                      <Check
                        className={cn(
                          "ml-auto w-4 h-4",
                          value === event.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 w-full">
        <Tabs defaultValue="individuals" className="w-full">
        <TabsList className="w-full overflow-x-auto overflow-y-hidden flex-nowrap justify-start py-8">
            <TabsTrigger value="individuals" className="m-2">Individuals</TabsTrigger>
            <TabsTrigger value="teams" className="m-2">Teams</TabsTrigger>
            <TabsTrigger value="teamsCreated" className="m-2">Teams Created by You</TabsTrigger>
          </TabsList>
          <TabsContent value="individuals" className="mt-4">
            <IndividualsUserIsInterestedInForEvent event={selectedEvent} />
          </TabsContent>

          <TabsContent value="teams" className="mt-4">
            <TeamsUserIsInterestedInForEvent event={selectedEvent} />
          </TabsContent>

          <TabsContent value="teamsCreated" className="mt-4">
            <TeamsCreatedPerEventByUser event={selectedEvent}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Leads;
