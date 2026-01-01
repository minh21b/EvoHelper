import { DamageProvider } from './context';
import { DamageContainer } from './components/DamageContainer';

export const DamagePage = () => {
  return (
    <DamageProvider>
      <DamageContainer/>
    </DamageProvider>
  )
};
