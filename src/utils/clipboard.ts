/**
 * Safe clipboard copy with fallback for iframe sandboxes and non-standard browser contexts.
 */
export async function copyTextSafely(text: string): Promise<boolean> {
  if (!text) return false;

  // Modern Async Clipboard API
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or blocked by iframe permissions policy, fallback below
  }

  // Fallback for older browsers or sandboxed iframes
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
