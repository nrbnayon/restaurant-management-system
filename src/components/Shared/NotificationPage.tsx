// src/Pages/Dashboard/Shared/NotificationPage.tsx
import DashboardHeader from "@/components/Dashboard/DashboardHeader";

const mockNotifications = [
  {
    id: 1,
    title: "Cheese is running low",
    time: "2 minutes ago",
    image: "/order1.png",
  },
  {
    id: 2,
    title: "New Order: Table 5",
    time: "2 minutes ago",
    image: "/order1.png",
  },
  {
    id: 3,
    title: "Cheese is running low",
    time: "2 minutes ago",
    image: "/order1.png",
  },
  {
    id: 4,
    title: "New Order: Table 5",
    time: "2 minutes ago",
    image: "/order1.png",
  },
  {
    id: 5,
    title: "Cheese is running low",
    time: "2 minutes ago",
    image: "/order1.png",
  },
  {
    id: 6,
    title: "Cheese is running low",
    time: "2 minutes ago",
    image: "/order1.png",
  },
  {
    id: 7,
    title: "New Order: Table 5",
    time: "2 minutes ago",
    image: "/order1.png",
  },
];

export default function NotificationPage() {
  return (
    <>
      <DashboardHeader title="Notification" />

      <main className="p-3 md:p-8">
        <div className="w-full mx-auto space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-card rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
            >
              {/* Notification Image */}
              <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-linear-to-br from-primary to-orange-600">
                <img
                  src={notification.image}
                  alt={notification.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
