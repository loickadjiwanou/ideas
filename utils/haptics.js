import * as Haptics from 'expo-haptics';

/**
 * Déclenche un retour haptique selon le niveau demandé.
 *
 * Niveaux disponibles :
 * - 'light'     : impact léger (ex: tap sur un bouton)
 * - 'medium'    : impact moyen (ex: début d'action, comme démarrer l'enregistrement)
 * - 'heavy'     : impact fort (ex: action importante)
 * - 'rigid'     : impact sec et net (iOS 13+, fallback sur 'heavy' ailleurs)
 * - 'soft'      : impact doux (iOS 13+, fallback sur 'light' ailleurs)
 * - 'success'   : notification de succès
 * - 'warning'   : notification d'avertissement
 * - 'error'     : notification d'erreur
 * - 'selection' : changement de sélection (ex: défilement d'un picker)
 *
 * @param {'light'|'medium'|'heavy'|'rigid'|'soft'|'success'|'warning'|'error'|'selection'} level
 * @returns {Promise<void>}
 */
export async function triggerHaptic(level = 'medium') {
    try {
        switch (level) {
            case 'light':
                return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            case 'medium':
                return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            case 'heavy':
                return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            case 'rigid':
                return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            case 'soft':
                return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            case 'success':
                return await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            case 'warning':
                return await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            case 'error':
                return await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            case 'selection':
                return await Haptics.selectionAsync();
            default:
                return await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    } catch (e) {
        console.warn('Haptics non disponible :', e?.message);
    }
}

export default triggerHaptic;