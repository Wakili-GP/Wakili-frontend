import Footer from "../components/Footer.tsx";
const HomePage = () => {
  const notifications = [
    {
      id: 1,
      title: "استشارة جديدة",
      message: "لديك استشارة قانونية جديدة",
      time: "منذ ساعة",
    },
    {
      id: 2,
      title: "تحديث الحالة",
      message: "تم تحديث حالة القضية",
      time: "منذ ساعتين",
    },
    {
      id: 3,
      title: "موعد قريب",
      message: "لديك موعد غدا في المحكمة",
      time: "منذ 3 ساعات",
    },
  ];
  return (
    <div>
      <Footer />
    </div>
  );
};
export default HomePage;
