import TermLifeForm from "./TermLifeForm";
import WholeLifeForm from "./WholeLifeForm";
import EndowmentForm from "./EndowmentForm";
import MoneyBackForm from "./MoneyBackForm";
import PensionAnnuityForm from "./PensionAnnuityForm";
import ChildPlansForm from "./ChildPlansForm";
import UlipsForm from "./UlipsForm";
import HealthForm from "./HealthForm";
import PersonalAccidentForm from "./PersonalAccidentForm";
import GroupHealthForm from "./GroupHealthForm";
import MotorForm from "./MotorForm";
import TravelForm from "./TravelForm";
import HomeForm from "./HomeForm";
import CommercialForm from "./CommercialForm";
import FireForm from "./FireForm";
import MarineForm from "./MarineForm";
import CyberForm from "./CyberForm";
import PetForm from "./PetForm";
import AgriculturalForm from "./AgriculturalForm";
import PoliticalRiskForm from "./PoliticalRiskForm";
import TerrorismForm from "./TerrorismForm";

export const CATEGORY_FORM_MAP = {
  term_life: TermLifeForm,
  whole_life: WholeLifeForm,
  endowment: EndowmentForm,
  money_back: MoneyBackForm,
  pension_annuity: PensionAnnuityForm,
  child_plans: ChildPlansForm,
  ulips: UlipsForm,
  health: HealthForm,
  personal_accident: PersonalAccidentForm,
  group_health: GroupHealthForm,
  motor: MotorForm,
  travel: TravelForm,
  home: HomeForm,
  commercial: CommercialForm,
  fire: FireForm,
  marine: MarineForm,
  cyber: CyberForm,
  pet: PetForm,
  agricultural: AgriculturalForm,
  political_risk: PoliticalRiskForm,
  terrorism: TerrorismForm,
};
