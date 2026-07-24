import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import "./Navigation.css";

export interface TabItem {
  content: ReactNode;
  disabled?: boolean;
  id: string;
  label: ReactNode;
}

export interface TabsProps {
  className?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  tabs: TabItem[];
  value?: string;
}

export function Tabs({
  className,
  defaultValue,
  onValueChange,
  tabs,
  value,
}: TabsProps) {
  const generatedId = useId();
  const firstEnabled = tabs.find((tab) => !tab.disabled)?.id ?? tabs[0]?.id;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const selectedValue = value ?? internalValue;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedTab = tabs.find((tab) => tab.id === selectedValue) ?? tabs[0];

  const selectTab = (tabId: string) => {
    setInternalValue(tabId);
    onValueChange?.(tabId);
  };

  const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    const enabledTabs = tabs
      .map((tab, index) => ({ ...tab, index }))
      .filter((tab) => !tab.disabled);
    const currentEnabledIndex = enabledTabs.findIndex((tab) => tab.index === currentIndex);
    const nextIndex = (currentEnabledIndex + direction + enabledTabs.length) % enabledTabs.length;
    const nextTab = enabledTabs[nextIndex];
    if (nextTab) {
      selectTab(nextTab.id);
      tabRefs.current[nextTab.index]?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(index, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const firstIndex = tabs.findIndex((tab) => !tab.disabled);
      if (firstIndex >= 0) {
        selectTab(tabs[firstIndex].id);
        tabRefs.current[firstIndex]?.focus();
      }
    } else if (event.key === "End") {
      event.preventDefault();
      const lastIndex = [...tabs].reverse().findIndex((tab) => !tab.disabled);
      const resolvedIndex = lastIndex >= 0 ? tabs.length - 1 - lastIndex : -1;
      if (resolvedIndex >= 0) {
        selectTab(tabs[resolvedIndex].id);
        tabRefs.current[resolvedIndex]?.focus();
      }
    }
  };

  return (
    <div className={cn("tabs", className)}>
      <div aria-label="Section tabs" className="tabs__list" role="tablist">
        {tabs.map((tab, index) => {
          const isSelected = tab.id === selectedValue;
          const tabId = `${generatedId}-tab-${tab.id}`;
          const panelId = `${generatedId}-panel-${tab.id}`;
          return (
            <button
              aria-controls={panelId}
              aria-selected={isSelected}
              className="tabs__tab"
              disabled={tab.disabled}
              id={tabId}
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {selectedTab ? (
        <div
          aria-labelledby={`${generatedId}-tab-${selectedTab.id}`}
          className="tabs__panel"
          id={`${generatedId}-panel-${selectedTab.id}`}
          role="tabpanel"
          tabIndex={0}
        >
          {selectedTab.content}
        </div>
      ) : null}
    </div>
  );
}
