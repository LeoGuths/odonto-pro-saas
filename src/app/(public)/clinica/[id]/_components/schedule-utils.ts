export function isSlotInThePast(slotTime: string) {
  const [slotHour, slotMinute] = slotTime.split(':').map(Number);

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (slotHour < currentHour) {
    return true;
  } else if (slotHour === currentHour && slotMinute <= currentMinute) {
    return true;
  }

  return false;
}

export function isToday(date: Date) {
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isSlotSequenceAvailable(
  startSlot: string,
  requiredSlots: number,
  allClinicSlots: string[],
  blockedSlots: string[]
): boolean {
  const startIndex = allClinicSlots.indexOf(startSlot);

  // Remover OR caso permitir agendar serviços grandes no último horário
  if (startIndex === -1 || startIndex + requiredSlots > allClinicSlots.length) {
    return false;
  }

  for (let i = startIndex; i < startIndex + requiredSlots; i++) {
    const slotTime = allClinicSlots[i];

    if (blockedSlots.includes(slotTime)) {
      return false;
    }
  }

  return true;
}
