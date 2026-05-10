import Close from '../assets/icons/close_large.svg';

export default function Modal({
  open,
  onClose,
  onUpdate,
  onClear,
  children,
  updateButtonText = 'Update',
  clearButtonText = 'Clear all',
  title = 'Modal',
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
      {/* modal */}
      <div
        onClick={e => e.stopPropagation()}
        className={`
          bg-white rounded shadow p-2 transition-all mx-4 max-w-[720px] ipad-portrait:mx-24 max-h-[90vh] relative flex flex-col
          ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}
        `}
      >
        <h3 className="px-4 pt-4 flex font-black bg-white justify-between w-full">
          <div className="font-bitmap-song font-header-02">{title}</div>
          {showCloseButton && (
            <div>
              <img
                src={Close}
                onClick={() => onClose(false)}
                className="cursor-pointer w-6 aspect-square inline-block"
                alt="Close modal"
              />
            </div>
          )}
        </h3>
        <div className="flex-1 overflow-y-auto">{children}</div>
        <div className="bg-white flex flex-wrap gap-10 justify-between items-center p-4 w-full text-lg text-center max-md:max-w-full mt-auto">
          <button
            onClick={() => onClear ? onClear() : onClose(false)}
            className="gap-1 self-stretch px-4 py-2 my-auto text-black bg-white border-black border border-solid min-h-[40px]"
          >
            {clearButtonText}
          </button>
          <button
            onClick={onUpdate}
            className="gap-1 px-4 py-2 my-auto text-white bg-black min-h-[40px]"
          >
            {updateButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
