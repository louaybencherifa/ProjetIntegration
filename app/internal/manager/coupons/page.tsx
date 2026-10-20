import InternalModule from "@/components/dashboard/internal-module";
import { CouponBatchList } from "@/components/dashboard/manager-data";

export default function ManagerCoupons() {
  return <InternalModule role="manager" title="Coupons" description="Créez et suivez les lots de coupons d'aide."><CouponBatchList /></InternalModule>;
}
