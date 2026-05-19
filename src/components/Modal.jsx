import CloseX from '../assets/icons/close.svg';

export default function Modal({
  open,
  onClose,
  onUpdate,
  onClear,
  clearDisabled = false,
  children,
  updateButtonText = 'Update',
  clearButtonText = 'Clear all',
  title = 'Modal',
  headerIcon,
  allowOutsideClick = true,
  showCloseButton = true,
}) {
  return (
    <div
      onClick={() => allowOutsideClick && onClose(false)}
      className={`
      fixed inset-0 flex justify-center items-center transition-colors max-h-lvh z-50
      ${open ? 'visible bg-black/50' : 'invisible'}
    `}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`
          bg-white rounded-[8px] border border-black shadow transition-all mx-4 w-[500px] max-w-[calc(100vw-2rem)] max-h-[90vh] relative flex flex-col overflow-hidden
          ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-8 py-3 border-b border-[#b9c0c7] bg-white shrink-0">
          {headerIcon && (
            <img src={headerIcon} className="w-7 h-7 shrink-0" alt="" />
          )}
          <span className="flex-1 text-[24px] font-normal leading-[1.5] text-black">{title}</span>
          {showCloseButton && (
            <button
              onClick={() => onClose(false)}
              className="border border-[#b9c0c7] rounded flex items-center justify-center w-7 h-7 shrink-0 hover:bg-gray-50"
              aria-label="Close"
            >
              <img src={CloseX} className="w-6 h-6" alt="Close" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-scroll min-h-0">{children}</div>

        {/* Footer */}
        <div className="bg-white flex items-center justify-between px-6 py-4 w-full border-t border-[#b9c0c7] shrink-0" style={{ boxShadow: '-1px -1px 8px 3px rgba(0,0,0,0.05)' }}>
          <button
            onClick={() => onClear ? onClear() : onClose(false)}
            disabled={clearDisabled}
            className={`text-[17px] leading-[1.5] h-10 px-4 bg-white border-0 ${clearDisabled ? 'text-[#b9c0c7] cursor-not-allowed' : 'text-[#e81717] hover:opacity-80'}`}
          >
            {clearButtonText}
          </button>
          <button
            onClick={onUpdate}
            className="border border-black rounded-full text-[17px] leading-[1.5] text-black h-10 px-4 hover:bg-gray-50"
          >
            {updateButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
